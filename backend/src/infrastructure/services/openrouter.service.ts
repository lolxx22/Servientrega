import OpenAI from 'openai';
import { env } from '../../config/env';
import { EnvioService } from '../../application/services/shipment.service';
import { TarifaEnvioService } from '../../application/services/shipping-rate.service';
import { SucursalService } from '../../application/services/branch.service';

const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: env.OPENROUTER_API_KEY?.trim(),
  defaultHeaders: {
    'HTTP-Referer': env.APP_URL,
    'X-Title': env.APP_NAME,
  },
});

const envioService = new EnvioService();
const tarifaEnvioService = new TarifaEnvioService();
const sucursalService = new SucursalService();

// ============================================
// HERRAMIENTAS SIMPLIFICADAS
// ============================================

const tools: OpenAI.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'getTrackingInfo',
      description: 'Obtener informacion de seguimiento de una guia de envio',
      parameters: {
        type: 'object',
        properties: {
          trackingNumber: {
            type: 'string',
            description: 'Numero de guia (ej: SERVI-2026-000001)',
          },
        },
        required: ['trackingNumber'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'calculateShippingCost',
      description: 'Calcular el costo de envio entre dos ciudades',
      parameters: {
        type: 'object',
        properties: {
          origin: { type: 'string', description: 'Ciudad de origen' },
          destination: { type: 'string', description: 'Ciudad de destino' },
          weight: { type: 'number', description: 'Peso en kilogramos' },
          productType: { type: 'string', description: 'Tipo de producto' },
        },
        required: ['origin', 'destination', 'weight'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'createShipment',
      description: 'Crear una guia de envio directamente',
      parameters: {
        type: 'object',
        properties: {
          senderName: { type: 'string', description: 'Nombre del remitente' },
          senderPhone: { type: 'string', description: 'Telefono del remitente' },
          senderAddress: { type: 'string', description: 'Direccion del remitente' },
          recipientName: { type: 'string', description: 'Nombre del destinatario' },
          recipientPhone: { type: 'string', description: 'Telefono del destinatario' },
          recipientAddress: { type: 'string', description: 'Direccion del destinatario' },
          origin: { type: 'string', description: 'Ciudad de origen' },
          destination: { type: 'string', description: 'Ciudad de destino' },
          weight: { type: 'number', description: 'Peso en kilogramos' },
          productType: { type: 'string', description: 'Tipo de producto' },
          cost: { type: 'number', description: 'Costo del envio calculado' },
        },
        required: ['senderName', 'senderPhone', 'senderAddress', 'recipientName', 'recipientPhone', 'recipientAddress', 'origin', 'destination', 'weight', 'cost'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getBranches',
      description: 'Obtener lista de sucursales disponibles',
      parameters: {
        type: 'object',
        properties: {
          city: { type: 'string', description: 'Ciudad para filtrar (opcional)' },
        },
      },
    },
  },
];

// ============================================
// SYSTEM PROMPT SIMPLIFICADO EN ESPAÑOL
// ============================================

const systemPrompt = `Eres ServiBot AI de Servientrega. Ayudas con envios y seguimiento.

FLUJO: 1) Pide origen y destino, 2) Datos remitente (nombre, tel, dir), 3) Datos destinatario, 4) Peso y tipo, 5) Calcula costo, 6) Confirma y crea guia.

CIUDADES: Quito, Guayaquil, Cuenca, Ambato, Manta, Loja, Latacunga, Riobamba.
GUIAS: SERVI-2026-XXXXXX.
Responde breve en espanol. Fuera de contexto: "Solo ayudo con Servientrega."`;

// ============================================
// UTILIDADES
// ============================================

function safeJsonParse(json: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(json);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

// ============================================
// SISTEMA DE COMPACTACION LOCAL (SIN TOKENS)
// ============================================

const COMPACT_THRESHOLD = 10;
const RECENT_MESSAGES_TO_KEEP = 5;

// Mensajes irrelevantes que se pueden eliminar
const IRRELEVANT_PATTERNS = [
  /^hola[!. ]*$/i,
  /^buenas[!. ]*$/i,
  /^buenos dias[!. ]*$/i,
  /^buenas tardes[!. ]*$/i,
  /^buenas noches[!. ]*$/i,
  /^gracias[!. ]*$/i,
  /^ok[!. ]*$/i,
  /^vale[!. ]*$/i,
  /^perfecto[!. ]*$/i,
  /^entendido[!. ]*$/i,
  /^si[!. ]*$/i,
  /^no[!. ]*$/i,
];

// Patrones para extraer informacion clave
const CITY_PATTERNS = [
  /(?:de|desde|origen)\s+(quito|guayaquil|cuenca|ambato|manta|loja|latacunga|riobamba)/i,
  /(quito|guayaquil|cuenca|ambato|manta|loja|latacunga|riobamba)\s+(?:a|hacia|para|destino)/i,
];

const WEIGHT_PATTERNS = [
  /(\d+(?:\.\d+)?)\s*(?:kg|kilos|kilogramos)/i,
  /peso\s*[:.]?\s*(\d+(?:\.\d+)?)\s*(?:kg|kilos)?/i,
];

const NAME_PATTERNS = [
  /(?:me llamo|soy|mi nombre es|nombre)\s+([A-ZÁÉÍÓÚ][a-záéíóú]+(?:\s+[A-ZÁÉÍÓÚ][a-záéíóú]+)*)/i,
  /(?:remitente|envia|enviar)\s*[:.]?\s*([A-ZÁÉÍÓÚ][a-záéíóú]+(?:\s+[A-ZÁÉÍÓÚ][a-záéíóú]+)*)/i,
  /(?:destinatario|recibe|para)\s*[:.]?\s*([A-ZÁÉÍÓÚ][a-záéíóú]+(?:\s+[A-ZÁÉÍÓÚ][a-záéíóú]+)*)/i,
];

const PHONE_PATTERNS = [
  /(?:telefono|celular|tel|cel)\s*[:.]?\s*(0\d{9,10})/i,
  /(0\d{9,10})/,
];

const ADDRESS_PATTERNS = [
  /(?:direccion|dir|av|avenida|calle)\s*[:.]?\s*([A-ZÁÉÍÓÚa-záéíóú0-9\s]+(?:n\d+[-]?\d*)?)/i,
];

function shouldCompact(messages: OpenAI.ChatCompletionMessageParam[]): boolean {
  return messages.length > COMPACT_THRESHOLD;
}

function cleanText(text: string): string {
  return text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function shorten(text: string, maxLength: number): string {
  const cleaned = cleanText(text);
  return cleaned.length > maxLength ? `${cleaned.slice(0, maxLength - 3)}...` : cleaned;
}

function filterIrrelevant(messages: OpenAI.ChatCompletionMessageParam[]): OpenAI.ChatCompletionMessageParam[] {
  return messages.filter((m) => {
    if (m.role === 'system') return false;
    const content = m.content?.toString() || '';
    return !IRRELEVANT_PATTERNS.some((pattern) => pattern.test(content));
  });
}

function extractKeyInfo(messages: OpenAI.ChatCompletionMessageParam[]): string[] {
  const info: string[] = [];
  const allText = messages.map((m) => m.content?.toString() || '').join(' ');

  // Extraer ciudades
  const cities = new Set<string>();
  CITY_PATTERNS.forEach((pattern) => {
    const matches = allText.match(pattern);
    if (matches) {
      cities.add(matches[1] || matches[0]);
    }
  });
  if (cities.size > 0) {
    info.push(`Ciudades: ${Array.from(cities).join(', ')}`);
  }

  // Extraer peso
  WEIGHT_PATTERNS.forEach((pattern) => {
    const matches = allText.match(pattern);
    if (matches) {
      info.push(`Peso: ${matches[1]} kg`);
    }
  });

  // Extraer nombres
  const names = new Set<string>();
  NAME_PATTERNS.forEach((pattern) => {
    const matches = allText.match(pattern);
    if (matches && matches[1]) {
      names.add(matches[1].trim());
    }
  });
  if (names.size > 0) {
    info.push(`Personas: ${Array.from(names).join(', ')}`);
  }

  // Extraer telefonos
  const phones = new Set<string>();
  PHONE_PATTERNS.forEach((pattern) => {
    const matches = allText.match(pattern);
    if (matches && matches[1]) {
      phones.add(matches[1]);
    }
  });
  if (phones.size > 0) {
    info.push(`Telefonos: ${Array.from(phones).join(', ')}`);
  }

  // Extraer direcciones
  ADDRESS_PATTERNS.forEach((pattern) => {
    const matches = allText.match(pattern);
    if (matches && matches[1]) {
      info.push(`Direccion: ${shorten(matches[1], 50)}`);
    }
  });

  // Extraer tipo de producto
  if (allText.match(/documento|papel|carta/i)) {
    info.push('Tipo: documento');
  } else if (allText.match(/paquete|caja|carga/i)) {
    info.push('Tipo: paquete');
  } else if (allText.match(/fragil|quebradizo/i)) {
    info.push('Tipo: fragil');
  }

  // Extraer costo mencionado
  const costMatch = allText.match(/\$\s*(\d+(?:\.\d+)?)/);
  if (costMatch) {
    info.push(`Costo: $${costMatch[1]}`);
  }

  // Extraer numero de guia
  const guiaMatch = allText.match(/SERVI-\d{4}-\d{6}/);
  if (guiaMatch) {
    info.push(`Guia: ${guiaMatch[0]}`);
  }

  return info;
}

function createLocalSummary(messages: OpenAI.ChatCompletionMessageParam[]): string {
  const filtered = filterIrrelevant(messages);
  const keyInfo = extractKeyInfo(filtered);

  if (keyInfo.length === 0) {
    return 'Sin contexto relevante';
  }

  return `Contexto: ${keyInfo.join(' | ')}`;
}

function compactMessages(
  messages: OpenAI.ChatCompletionMessageParam[]
): OpenAI.ChatCompletionMessageParam[] {
  if (!shouldCompact(messages)) {
    return messages;
  }

  const oldMessages = messages.slice(0, -RECENT_MESSAGES_TO_KEEP);
  const recentMessages = messages.slice(-RECENT_MESSAGES_TO_KEEP);

  const summary = createLocalSummary(oldMessages);

  return [
    { role: 'system', content: summary },
    ...recentMessages,
  ];
}

// ============================================
// SERVICIO PRINCIPAL
// ============================================

interface ChatResult {
  content: string;
  tokensUsed: number;
}

export class AIService {
  async chat(messages: OpenAI.ChatCompletionMessageParam[], userId?: number): Promise<ChatResult> {
    // Compactar mensajes localmente (sin tokens)
    const compressedMessages = compactMessages(messages);

    const response = await openrouter.chat.completions.create({
      model: 'anthropic/claude-3-haiku',
      messages: [{ role: 'system', content: systemPrompt }, ...compressedMessages],
      tools,
      max_tokens: 300,
    });

    const tokensUsed = response.usage?.total_tokens || 0;
    const choice = response.choices[0];
    const toolCalls = choice.message.tool_calls;

    if (toolCalls && toolCalls.length > 0) {
      const updatedMessages: OpenAI.ChatCompletionMessageParam[] = [
        ...compressedMessages,
        choice.message,
      ];

      for (const toolCall of toolCalls) {
        const args = safeJsonParse(toolCall.function.arguments) as Record<string, string | number | undefined>;
        let result: unknown;

        switch (toolCall.function.name) {
          case 'getTrackingInfo':
            try {
              const envio = await envioService.findByTrackingNumber(args.trackingNumber as string);
              result = envio || { error: 'Guia no encontrada' };
            } catch {
              result = { error: 'Guia no encontrada' };
            }
            break;

          case 'calculateShippingCost':
            try {
              const cost = await tarifaEnvioService.calculateCost(
                args.origin as string,
                args.destination as string,
                args.weight as number,
                args.productType as string
              );
              if (cost) {
                result = {
                  origin: args.origin,
                  destination: args.destination,
                  weight: args.weight,
                  baseRate: cost.tarifaBase,
                  weightCost: cost.costoPeso,
                  totalCost: cost.costoTotal,
                };
              } else {
                result = { error: 'No se encontro tarifa para esta ruta' };
              }
            } catch {
              result = { error: 'Error al calcular el costo' };
            }
            break;

          case 'createShipment':
            try {
              const { envio, numeroGuia } = await envioService.createDirect({
                remitenteNombre: args.senderName as string,
                remitenteTelefono: args.senderPhone as string,
                remitenteDireccion: args.senderAddress as string,
                destinatarioNombre: args.recipientName as string,
                destinatarioTelefono: args.recipientPhone as string,
                destinatarioDireccion: args.recipientAddress as string,
                origen: args.origin as string,
                destino: args.destination as string,
                peso: args.weight as number,
                tipoProducto: args.productType as string,
                costoEnvio: args.cost as number,
              });

              result = {
                trackingNumber: numeroGuia,
                origin: args.origin,
                destination: args.destination,
                totalCost: args.cost,
                status: 'CREADA',
              };
            } catch {
              result = { error: 'Error al crear la guia' };
            }
            break;

          case 'getBranches':
            try {
              let branches;
              if (args.city) {
                branches = await sucursalService.findByCiudad(args.city as string);
              } else {
                branches = await sucursalService.findAll();
              }

              result = branches.map((b) => ({
                nombre: b.nombre,
                codigo: b.codigo,
                ciudad: b.ciudad,
                direccion: b.direccion,
                telefono: b.telefono,
              }));
            } catch {
              result = { error: 'Error al obtener sucursales' };
            }
            break;

          default:
            result = { error: 'Herramienta no reconocida' };
        }

        updatedMessages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });
      }

      const finalResponse = await openrouter.chat.completions.create({
        model: 'anthropic/claude-3-haiku',
        messages: updatedMessages,
        tools,
        max_tokens: 300,
      });

      const finalTokens = finalResponse.usage?.total_tokens || 0;

      return {
        content: finalResponse.choices[0].message.content || '',
        tokensUsed: tokensUsed + finalTokens,
      };
    }

    return {
      content: choice.message.content || '',
      tokensUsed,
    };
  }
}
