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

const systemPrompt = `Eres ServiBot AI de Servientrega.

REGLAS PRINCIPALES:
- Si te saludan: responde con un saludo breve y pregunta cómo ayudar.
- Solo ayudo con temas de Servientrega (envíos, seguimiento, cotización).

FLUJO PARA CREAR GUÍA:
1. Cuando pidan crear guía/envío, solicita TODOS los datos de una vez en este formato:
   - Ciudad de origen
   - Ciudad de destino
   - Remitente: nombre, teléfono, dirección (corta)
   - Destinatario: nombre, teléfono, dirección (corta)
   - Peso en kilogramos
   - Tipo de producto

2. Cuando el usuario proporcione TODOS los datos:
   - PRIMERO ejecuta la tool calculateShippingCost con origen, destino, peso y tipo
   - Muestra el costo calculado al usuario
   - Pide confirmación: "¿Confirmas crear la guía con costo $X.XX?"

3. Cuando el usuario confirme (sí, confirmo, ok, dale):
   - Ejecuta la tool createShipment con TODOS los datos incluyendo el costo
   - Confirma con el número de guía generado

4. Si hay error al crear la guía, muestra el error específico y pide verificar datos.

TIPOS: Documento, Encomienda, Paquete, Caja, Electrodoméstico, Tecnología, Ropa, Muebles, Alimentos, Medicamentos, Frágil.

CIUDADES (24): Quito, Guayaquil, Cuenca, Ambato, Portoviejo, Manta, Loja, Riobamba, Latacunga, Santo Domingo, Esmeraldas, Ibarra, Santa Elena, Salinas, Tulcán, Milagro, Babahoyo, Guaranda, Azogues, Macas, Puyo, Tena, Lago Agrio, Coca.

GUIAS: SERVI-2026-XXXXXX.
Responde breve en español.`;

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
    const compressedMessages = compactMessages(messages);
    let currentMessages: OpenAI.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...compressedMessages,
    ];
    let totalTokens = 0;
    const MAX_ROUNDS = 5;

    for (let round = 0; round < MAX_ROUNDS; round++) {
      const response = await openrouter.chat.completions.create({
        model: 'anthropic/claude-3-haiku',
        messages: currentMessages,
        tools,
        max_tokens: 500,
      });

      totalTokens += response.usage?.total_tokens || 0;
      const choice = response.choices[0];
      const toolCalls = choice.message.tool_calls;

      // No hay más tool calls → retornar respuesta final de texto
      if (!toolCalls || toolCalls.length === 0) {
        return {
          content: choice.message.content || '',
          tokensUsed: totalTokens,
        };
      }

      // Agregar el mensaje del assistant con tool_calls al historial
      currentMessages.push(choice.message);

      // Ejecutar cada tool call
      for (const toolCall of toolCalls) {
        const args = safeJsonParse(toolCall.function.arguments) as Record<string, string | number | undefined>;
        let result: unknown;

        switch (toolCall.function.name) {
          case 'getTrackingInfo':
            try {
              const envio = await envioService.findByTrackingNumber(args.trackingNumber as string);
              if (envio) {
                result = {
                  success: true,
                  trackingNumber: envio.numeroGuia,
                  status: envio.estado,
                  location: envio.ubicacion,
                  description: envio.descripcion,
                  lastUpdate: envio.fechaUltimaActualizacion,
                  estimatedDelivery: envio.fechaEstimadaEntrega,
                };
              } else {
                result = { 
                  error: `No se encontró la guía ${args.trackingNumber}`,
                  suggestion: 'Verifica el número de guía e intenta de nuevo'
                };
              }
            } catch (error) {
              const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
              result = { error: `Error al buscar la guía: ${errorMsg}` };
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
                  success: true,
                  origin: args.origin,
                  destination: args.destination,
                  weight: args.weight,
                  productType: args.productType,
                  baseRate: cost.tarifaBase,
                  weightCost: cost.costoPeso,
                  totalCost: cost.costoTotal,
                  message: `Costo de envío de ${args.origin} a ${args.destination}: $${cost.costoTotal.toFixed(2)}`,
                };
              } else {
                result = { 
                  error: `No se encontró tarifa para la ruta ${args.origin} → ${args.destination}`,
                  suggestion: 'Verifica que ambas ciudades estén disponibles en nuestro sistema'
                };
              }
            } catch (error) {
              const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
              result = { error: `Error al calcular el costo: ${errorMsg}` };
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
                success: true,
                trackingNumber: numeroGuia,
                origin: args.origin,
                destination: args.destination,
                weight: args.weight,
                totalCost: args.cost,
                status: 'CREADA',
                message: `Guía ${numeroGuia} creada exitosamente`,
              };
            } catch (error) {
              const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
              result = { 
                error: `Error al crear la guía: ${errorMsg}`,
                details: {
                  senderName: args.senderName,
                  recipientName: args.recipientName,
                  origin: args.origin,
                  destination: args.destination,
                }
              };
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

              if (branches && branches.length > 0) {
                result = {
                  success: true,
                  count: branches.length,
                  branches: branches.map((b) => ({
                    nombre: b.nombre,
                    codigo: b.codigo,
                    ciudad: b.ciudad,
                    direccion: b.direccion,
                    telefono: b.telefono,
                  })),
                };
              } else {
                result = { 
                  error: args.city 
                    ? `No se encontraron sucursales en ${args.city}` 
                    : 'No se encontraron sucursales',
                  suggestion: 'Intenta con otra ciudad o solicita información al 1800-SERVI'
                };
              }
            } catch (error) {
              const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
              result = { error: `Error al obtener sucursales: ${errorMsg}` };
            }
            break;

          default:
            result = { error: 'Herramienta no reconocida' };
        }

        // Agregar resultado de la tool al historial
        currentMessages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });
      }
    }

    // Si llegamos aquí, se agotaron las rondas
    return {
      content: 'Disculpa, hubo un problema al procesar tu solicitud. Por favor, intenta de nuevo.',
      tokensUsed: totalTokens,
    };
  }
}
