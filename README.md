# SERVIBOT AI

## Plataforma Inteligente de Atención y Gestión Logística para Servientrega

### Descripción

SERVIBOT AI es una plataforma web empresarial moderna diseñada para transformar la atención al cliente y optimizar los procesos logísticos mediante Inteligencia Artificial Conversacional.

### Características Principales

- 🤖 **Chatbot Inteligente** - Asistente virtual con IA para resolver consultas 24/7
- 📦 **Seguimiento de Envíos** - Rastreo en tiempo real con número de guía
- 🚚 **Gestión de Envíos** - Creación y administración de órdenes de envío
- 📊 **Dashboard Administrativo** - Métricas y gráficos en tiempo real
- 🔐 **Autenticación Segura** - Sistema de roles (Admin, Operador, Cliente)

### Stack Tecnológico

**Frontend:**
- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- React Router 7
- Zustand (Estado global)
- Framer Motion (Animaciones)
- Recharts (Gráficos)
- Lucide React (Iconos)

**Backend:**
- Express 4 + TypeScript
- Prisma ORM
- PostgreSQL 16
- JWT (Autenticación)
- Bcrypt (Encriptación)
- OpenRouter AI (Inteligencia Artificial)

**Infraestructura:**
- Docker & Docker Compose
- PostgreSQL (Base de datos)

### Instalación

#### Prerrequisitos

- Node.js 20+
- Docker y Docker Compose
- npm o yarn

#### Paso 1: Clonar el proyecto

```bash
cd Desktop\Servientrega
```

#### Paso 2: Configurar variables de entorno

```bash
cp .env.example .env
```

Editar el archivo `.env` con tus configuraciones.

#### Paso 3: Instalar dependencias

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd backend
npm install
```

#### Paso 4: Generar cliente Prisma

```bash
cd backend
npx prisma generate
```

#### Paso 5: Iniciar con Docker

```bash
docker-compose up -d
```

#### Paso 6: Ejecutar seed de la base de datos

```bash
cd backend
npm run db:seed
```

### Estructura del Proyecto

```
Servientrega/
├── frontend/                 # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/           # Páginas de la aplicación
│   │   ├── stores/          # Estado global (Zustand)
│   │   ├── services/        # Servicios API
│   │   └── types/           # Tipos TypeScript
│   └── package.json
│
├── backend/                  # Express + TypeScript + Prisma
│   ├── src/
│   │   ├── config/          # Configuración
│   │   ├── domain/          # Dominio (entidades, repositorios)
│   │   ├── application/     # Servicios y DTOs
│   │   ├── infrastructure/  # HTTP, DB, servicios externos
│   │   └── shared/          # Utilidades compartidas
│   ├── prisma/
│   │   └── schema.prisma    # Schema de base de datos
│   └── package.json
│
├── database/                 # Scripts de inicialización
├── docker-compose.yml       # Configuración Docker
├── .env                     # Variables de entorno
└── README.md
```

### Endpoints API

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/auth/register` | Registrar usuario | No |
| POST | `/api/auth/login` | Iniciar sesión | No |
| GET | `/api/auth/profile` | Obtener perfil | Sí |
| GET | `/api/users` | Listar usuarios | Admin |
| POST | `/api/clients` | Crear cliente | Admin/Operador |
| GET | `/api/clients` | Listar clientes | Admin/Operador |
| POST | `/api/shipments` | Crear envío | Admin/Operador |
| GET | `/api/shipments` | Listar envíos | Admin/Operador |
| GET | `/api/shipments/tracking/:guia` | Rastrear guía | No |
| POST | `/api/ai/chat` | Chat con IA | Sí |
| GET | `/api/dashboard/metrics` | Métricas | Admin |
| GET | `/api/dashboard/charts` | Datos gráficos | Admin |

### Usuarios de Prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@servientrega.com | admin123 |
| Operador | operador@servientrega.com | operador123 |
| Cliente | cliente@email.com | cliente123 |

### Conexión con DBeaver

- **Host:** localhost
- **Port:** 5432
- **Database:** servibot_db
- **Username:** servibot
- **Password:** servibot123

### Comandos Útiles

```bash
# Desarrollo
npm run dev          # Iniciar en modo desarrollo

# Base de datos
npm run db:generate  # Generar cliente Prisma
npm run db:push      # Sincronizar schema
npm run db:migrate   # Crear migración
npm run db:seed      # Ejecutar seed
npm run db:studio    # Abrir Prisma Studio

# Docker
docker-compose up -d         # Iniciar contenedores
docker-compose down          # Detener contenedores
docker-compose logs -f       # Ver logs
```

### Licencia

Proyecto privado - Servientrega 2026
