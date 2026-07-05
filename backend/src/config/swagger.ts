const swaggerSpec: Record<string, unknown> & { openapi: string; info: Record<string, unknown>; paths: Record<string, unknown>; components: Record<string, unknown> } = {
  openapi: '3.0.0',
  info: {
    title: 'Servibot AI API',
    version: '1.0.0',
    description:
      'API de la plataforma logistica Servibot AI - Servientrega.\n\nDocumentacion del endpoint de actualizacion de estado de envios (guias).',
    contact: {
      name: 'Servibot AI',
      email: 'soporte@servientrega.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor de desarrollo',
    },
  ],
  tags: [
    {
      name: 'Auth',
      description: 'Autenticacion - Login con credenciales reales',
    },
    {
      name: 'Users',
      description: 'Gestion de usuarios y roles',
    },
    {
      name: 'Shipments',
      description: 'Gestion de envios y guias',
    },
  ],
  paths: {
    '/api/swagger-login': {
      post: {
        tags: ['Auth'],
        summary: 'Login para obtener token JWT',
        description:
          'Inicia sesion con credenciales reales para obtener un token JWT y probar la API desde Swagger.\n\n**Credenciales admin:** `admin@servientrega.com` / `admin123`',
        operationId: 'swaggerLogin',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SwaggerLoginRequest',
              },
              example: {
                email: 'admin@servientrega.com',
                password: 'admin123',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Token generado exitosamente',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          $ref: '#/components/schemas/SwaggerLoginResponse',
                        },
                        message: {
                          type: 'string',
                          example: 'Token generado exitosamente',
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          '401': {
            description: 'Credenciales invalidas',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
                example: {
                  success: false,
                  error: {
                    code: 'UNAUTHORIZED',
                    message: 'Credenciales invalidas',
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/users/{id}/rol': {
      patch: {
        tags: ['Users'],
        summary: 'Cambiar rol de un usuario',
        description:
          'Cambia el rol de un usuario existente entre ADMIN y OPERATOR.\n\nRequiere rol **ADMIN**.',
        operationId: 'changeUserRole',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'integer',
            },
            description: 'ID del usuario',
            example: 1,
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ChangeRolRequest',
              },
              examples: {
                asignar_admin: {
                  summary: 'Asignar rol ADMIN',
                  value: {
                    rol: 'ADMIN',
                  },
                },
                asignar_operator: {
                  summary: 'Asignar rol OPERATOR',
                  value: {
                    rol: 'OPERATOR',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Rol actualizado exitosamente',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          $ref: '#/components/schemas/Usuario',
                        },
                        message: {
                          type: 'string',
                          example: 'Rol actualizado exitosamente',
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          '400': {
            description: 'Rol no valido',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
                example: {
                  success: false,
                  error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Rol no valido. Valores permitidos: ADMIN, OPERATOR',
                  },
                },
              },
            },
          },
          '401': {
            description: 'No autenticado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '403': {
            description: 'Sin permisos - Se requiere rol ADMIN',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '404': {
            description: 'Usuario no encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
                example: {
                  success: false,
                  error: {
                    code: 'NOT_FOUND',
                    message: 'Usuario no encontrado',
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/shipments/{id}/status': {
      put: {
        tags: ['Shipments'],
        summary: 'Actualizar estado de un envio',
        description:
          'Actualiza el estado de una guia de envio y opcionalmente crea un registro de tracking con la ubicacion actual.\n\nRequiere rol **ADMIN** u **OPERATOR**.',
        operationId: 'updateShipmentStatus',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'integer',
            },
            description: 'ID del envio a actualizar',
            example: 1,
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateStatusRequest',
              },
              examples: {
                cambiar_estado_con_ubicacion: {
                  summary: 'Cambiar a En Transito con ubicacion',
                  description: 'Actualiza el estado y crea un registro de tracking con la ubicacion',
                  value: {
                    estado: 'EN_TRANSITO',
                    ubicacion: 'Centro de distribucion Quito',
                  },
                },
                solo_estado: {
                  summary: 'Solo cambiar estado (sin ubicacion)',
                  description: 'Actualiza el estado sin crear registro de tracking adicional',
                  value: {
                    estado: 'ENTREGADO',
                  },
                },
                recibido_agencia: {
                  summary: 'Marcar como recibido en agencia',
                  value: {
                    estado: 'RECIBIDO_AGENCIA',
                    ubicacion: 'Servientrega Guayaquil - Av. Juan Tanca Marengo',
                  },
                },
                en_transito: {
                  summary: 'Marcar en tránsito',
                  value: {
                    estado: 'EN_TRANSITO',
                    ubicacion: 'Centro logístico Quito',
                  },
                },
                en_distribucion: {
                  summary: 'Marcar en distribución',
                  value: {
                    estado: 'EN_DISTRIBUCION',
                    ubicacion: 'En distribución - Guayaquil',
                  },
                },
                cancelado: {
                  summary: 'Cancelar envio',
                  value: {
                    estado: 'CANCELADO',
                    ubicacion: 'Oficina Quito - cliente solicito cancelacion',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Estado actualizado exitosamente',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          $ref: '#/components/schemas/Envio',
                        },
                        message: {
                          type: 'string',
                          example: 'Estado actualizado exitosamente',
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          '400': {
            description: 'Datos invalidos o estado no valido',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
                example: {
                  success: false,
                  error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Estado no valido',
                  },
                },
              },
            },
          },
          '401': {
            description: 'No autenticado - Token JWT faltante o invalido',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
                example: {
                  success: false,
                  error: {
                    code: 'UNAUTHORIZED',
                    message: 'Token de acceso requerido',
                  },
                },
              },
            },
          },
          '403': {
            description: 'Sin permisos - Se requiere rol ADMIN u OPERATOR',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
                example: {
                  success: false,
                  error: {
                    code: 'FORBIDDEN',
                    message: 'No tienes permisos para realizar esta accion',
                  },
                },
              },
            },
          },
          '404': {
            description: 'Envio no encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
                example: {
                  success: false,
                  error: {
                    code: 'NOT_FOUND',
                    message: 'Envio no encontrado',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT obtenido del endpoint POST /api/auth/login',
      },
    },
    schemas: {
      ApiResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          data: {
            type: 'object',
            description: 'Datos de la respuesta',
          },
          message: {
            type: 'string',
            example: 'Estado actualizado exitosamente',
          },
          error: {
            type: 'object',
            properties: {
              code: {
                type: 'string',
                example: 'NOT_FOUND',
              },
              message: {
                type: 'string',
                example: 'Envio no encontrado',
              },
            },
          },
        },
      },
      EstadoEnvio: {
        type: 'string',
        enum: [
          'GENERADO',
          'RECIBIDO_AGENCIA',
          'EN_TRANSITO',
          'EN_DISTRIBUCION',
          'ENTREGADO',
          'CANCELADO',
        ],
        description: 'Estados posibles de un envio',
      },
      UpdateStatusRequest: {
        type: 'object',
        required: ['estado'],
        properties: {
          estado: {
            $ref: '#/components/schemas/EstadoEnvio',
          },
          ubicacion: {
            type: 'string',
            description:
              'Ubicacion actual del paquete (opcional). Si se proporciona, se crea un registro de tracking.',
            example: 'Centro de distribucion Quito',
          },
        },
      },
      Envio: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1,
          },
          numeroGuia: {
            type: 'string',
            example: 'SERVI-2026-000123',
          },
          creadoPorId: {
            type: 'integer',
            nullable: true,
            example: 1,
          },
          remitenteNombre: {
            type: 'string',
            example: 'Juan Perez',
          },
          remitenteTelefono: {
            type: 'string',
            example: '+593991234567',
          },
          remitenteDireccion: {
            type: 'string',
            example: 'Av. Amazonas N36-50, Quito',
          },
          destinatarioNombre: {
            type: 'string',
            example: 'Maria Garcia',
          },
          destinatarioTelefono: {
            type: 'string',
            example: '+593987654321',
          },
          destinatarioDireccion: {
            type: 'string',
            example: 'Av. 9 de Octubre 123, Guayaquil',
          },
          origen: {
            type: 'string',
            example: 'Quito',
          },
          destino: {
            type: 'string',
            example: 'Guayaquil',
          },
          peso: {
            type: 'number',
            example: 2.5,
          },
          tipoProducto: {
            type: 'string',
            nullable: true,
            example: 'Documentos',
          },
          costoEnvio: {
            type: 'number',
            nullable: true,
            example: 12.5,
          },
          estado: {
            $ref: '#/components/schemas/EstadoEnvio',
          },
          sucursalId: {
            type: 'integer',
            nullable: true,
            example: 1,
          },
          fechaCreacion: {
            type: 'string',
            format: 'date-time',
          },
          fechaRecoleccion: {
            type: 'string',
            format: 'date-time',
            nullable: true,
          },
          fechaEntrega: {
            type: 'string',
            format: 'date-time',
            nullable: true,
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          error: {
            type: 'object',
            properties: {
              code: {
                type: 'string',
              },
              message: {
                type: 'string',
              },
            },
          },
        },
      },
      SwaggerLoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            description: 'Email del usuario',
            example: 'admin@servientrega.com',
          },
          password: {
            type: 'string',
            description: 'Contrasena del usuario',
            example: 'admin123',
          },
        },
      },
      SwaggerLoginResponse: {
        type: 'object',
        properties: {
          token: {
            type: 'string',
            description: 'Token JWT para usar en Authorize',
            example: 'eyJhbGciOiJIUzI1NiIs...',
          },
          user: {
            type: 'object',
            properties: {
              id: {
                type: 'integer',
                example: 1,
              },
              nombre: {
                type: 'string',
                example: 'Administrador',
              },
              email: {
                type: 'string',
                example: 'admin@servientrega.com',
              },
              rol: {
                type: 'string',
                example: 'ADMIN',
              },
            },
          },
        },
      },
      ChangeRolRequest: {
        type: 'object',
        required: ['rol'],
        properties: {
          rol: {
            type: 'string',
            enum: ['ADMIN', 'OPERATOR'],
            description: 'Nuevo rol del usuario',
            example: 'ADMIN',
          },
        },
      },
      Usuario: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1,
          },
          nombre: {
            type: 'string',
            example: 'Juan Perez',
          },
          email: {
            type: 'string',
            example: 'juan@servientrega.com',
          },
          rol: {
            type: 'string',
            enum: ['ADMIN', 'OPERATOR'],
            example: 'OPERATOR',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
    },
  },
};

export default swaggerSpec;
