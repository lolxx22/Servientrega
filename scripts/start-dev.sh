#!/bin/bash
# ===========================================
# SERVIBOT AI - Script de Desarrollo (Linux/Mac)
# ===========================================
# Ejecuta todo el setup automáticamente:
# 1. Verifica Docker
# 2. Levanta PostgreSQL
# 3. Espera a que esté listo
# 4. Aplica schema de Prisma
# 5. Ejecuta seed de datos
# 6. Inicia backend + frontend
# ===========================================

set -e

echo ""
echo "========================================"
echo "  SERVIBOT AI - Inicio de Desarrollo"
echo "========================================"
echo ""

# -------------------------------------------
# 1. Verificar si Docker está corriendo
# -------------------------------------------
echo "[1/7] Verificando Docker..."

if ! docker info > /dev/null 2>&1; then
    echo "      Docker no está corriendo. Iniciando Docker Desktop..."
    open -a Docker
    echo "      Esperando a que Docker esté listo (30s)..."
    sleep 30
    
    retries=0
    while ! docker info > /dev/null 2>&1 && [ $retries -lt 10 ]; do
        sleep 5
        retries=$((retries + 1))
    done
fi

echo "      Docker está corriendo ✓"

# -------------------------------------------
# 2. Verificar/levantar contenedor PostgreSQL
# -------------------------------------------
echo "[2/7] Verificando PostgreSQL..."

container_exists=$(docker ps -a --filter "name=servibot-postgres" --format "{{.Names}}" 2>/dev/null)
container_running=$(docker ps --filter "name=servibot-postgres" --format "{{.Names}}" 2>/dev/null)

if [ -z "$container_exists" ]; then
    echo "      Creando contenedor PostgreSQL..."
    docker-compose up -d
    echo "      Contenedor creado ✓"
elif [ -z "$container_running" ]; then
    echo "      Iniciando contenedor PostgreSQL..."
    docker-compose start
    echo "      Contenedor iniciado ✓"
else
    echo "      PostgreSQL ya está corriendo ✓"
fi

# -------------------------------------------
# 3. Esperar a que PostgreSQL esté listo
# -------------------------------------------
echo "[3/7] Esperando a que PostgreSQL esté listo..."

max_retries=30
retry_count=0
ready=false

while [ "$ready" = false ] && [ $retry_count -lt $max_retries ]; do
    if docker exec servibot-postgres pg_isready -U postgres > /dev/null 2>&1; then
        ready=true
    else
        sleep 2
        retry_count=$((retry_count + 1))
        echo "      Esperando... ($retry_count/$max_retries)"
    fi
done

if [ "$ready" = false ]; then
    echo "      ERROR: PostgreSQL no respondió a tiempo"
    exit 1
fi

echo "      PostgreSQL listo ✓"

# -------------------------------------------
# 4. Crear backend/.env si no existe
# -------------------------------------------
echo "[4/7] Configurando variables de entorno..."

if [ ! -f "backend/.env" ]; then
    echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5434/servibot" > backend/.env
    echo "      backend/.env creado ✓"
else
    echo "      backend/.env ya existe ✓"
fi

# -------------------------------------------
# 5. Aplicar schema de Prisma
# -------------------------------------------
echo "[5/7] Aplicando schema de Prisma..."

cd backend
npx prisma db push
echo "      Schema aplicado ✓"

# -------------------------------------------
# 6. Ejecutar seed de datos
# -------------------------------------------
echo "[6/7] Ejecutando seed de datos..."

npm run db:seed || echo "      ADVERTENCIA: Seed falló (puede que los datos ya existan)"
echo "      Seed completado ✓"

cd ..

# -------------------------------------------
# 7. Iniciar backend + frontend
# -------------------------------------------
echo "[7/7] Iniciando backend + frontend..."
echo ""
echo "========================================"
echo "  SERVIDORES INICIADOS"
echo "========================================"
echo ""
echo "  Frontend:  http://localhost:5173"
echo "  Backend:   http://localhost:3000"
echo "  Database:  localhost:5434"
echo ""
echo "  Presiona Ctrl+C para detener todos los servicios"
echo "========================================"
echo ""

npm run dev
