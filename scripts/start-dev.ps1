# ===========================================
# SERVIBOT AI - Script de Desarrollo (Windows)
# ===========================================
# Ejecuta todo el setup automáticamente:
# 1. Verifica Docker
# 2. Levanta PostgreSQL
# 3. Espera a que esté listo
# 4. Aplica schema de Prisma
# 5. Ejecuta seed de datos
# 6. Inicia backend + frontend
# ===========================================

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SERVIBOT AI - Inicio de Desarrollo" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# -------------------------------------------
# 1. Verificar si Docker está corriendo
# -------------------------------------------
Write-Host "[1/7] Verificando Docker..." -ForegroundColor Yellow

try {
    docker info 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "Docker no disponible" }
    Write-Host "      Docker está corriendo ✓" -ForegroundColor Green
} catch {
    Write-Host "      Docker no está corriendo. Iniciando Docker Desktop..." -ForegroundColor Yellow
    
    $dockerPaths = @(
        "C:\Program Files\Docker\Docker\Docker Desktop.exe",
        "$env:LOCALAPPDATA\Docker\Docker\Docker Desktop.exe"
    )
    
    $dockerFound = $false
    foreach ($path in $dockerPaths) {
        if (Test-Path $path) {
            Start-Process $path
            $dockerFound = $true
            break
        }
    }
    
    if (-not $dockerFound) {
        Write-Host "      ERROR: No se encontró Docker Desktop" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "      Esperando a que Docker esté listo (30s)..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30
    
    # Reintentar conexión
    $retries = 0
    while ($retries -lt 10) {
        try {
            docker info 2>&1 | Out-Null
            if ($LASTEXITCODE -eq 0) { break }
        } catch {}
        Start-Sleep -Seconds 5
        $retries++
    }
    
    Write-Host "      Docker iniciado ✓" -ForegroundColor Green
}

# -------------------------------------------
# 2. Verificar/levantar contenedor PostgreSQL
# -------------------------------------------
Write-Host "[2/7] Verificando PostgreSQL..." -ForegroundColor Yellow

$containerExists = docker ps -a --filter "name=servibot-postgres" --format "{{.Names}}" 2>$null
$containerRunning = docker ps --filter "name=servibot-postgres" --format "{{.Names}}" 2>$null

if (-not $containerExists) {
    Write-Host "      Creando contenedor PostgreSQL..." -ForegroundColor Yellow
    docker-compose up -d
    if ($LASTEXITCODE -ne 0) {
        Write-Host "      ERROR: No se pudo crear el contenedor" -ForegroundColor Red
        exit 1
    }
    Write-Host "      Contenedor creado ✓" -ForegroundColor Green
} elseif (-not $containerRunning) {
    Write-Host "      Iniciando contenedor PostgreSQL..." -ForegroundColor Yellow
    docker-compose start
    Write-Host "      Contenedor iniciado ✓" -ForegroundColor Green
} else {
    Write-Host "      PostgreSQL ya está corriendo ✓" -ForegroundColor Green
}

# -------------------------------------------
# 3. Esperar a que PostgreSQL esté listo
# -------------------------------------------
Write-Host "[3/7] Esperando a que PostgreSQL esté listo..." -ForegroundColor Yellow

$maxRetries = 30
$retryCount = 0
$ready = $false

while (-not $ready -and $retryCount -lt $maxRetries) {
    $result = docker exec servibot-postgres pg_isready -U postgres 2>&1
    if ($LASTEXITCODE -eq 0) {
        $ready = $true
    } else {
        Start-Sleep -Seconds 2
        $retryCount++
        Write-Host "      Esperando... ($retryCount/$maxRetries)" -ForegroundColor Gray
    }
}

if (-not $ready) {
    Write-Host "      ERROR: PostgreSQL no respondió a tiempo" -ForegroundColor Red
    exit 1
}

Write-Host "      PostgreSQL listo ✓" -ForegroundColor Green

# -------------------------------------------
# 4. Crear backend/.env si no existe
# -------------------------------------------
Write-Host "[4/7] Configurando variables de entorno..." -ForegroundColor Yellow

$backendEnvPath = "backend\.env"
if (-not (Test-Path $backendEnvPath)) {
    $envContent = "DATABASE_URL=postgresql://postgres:postgres@localhost:5434/servibot`n"
    Set-Content -Path $backendEnvPath -Value $envContent
    Write-Host "      backend/.env creado ✓" -ForegroundColor Green
} else {
    Write-Host "      backend/.env ya existe ✓" -ForegroundColor Green
}

# -------------------------------------------
# 5. Aplicar schema de Prisma
# -------------------------------------------
Write-Host "[5/7] Aplicando schema de Prisma..." -ForegroundColor Yellow

Set-Location -Path "backend"
npx prisma db push 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "      ERROR: Fallo al aplicar schema" -ForegroundColor Red
    Set-Location -Path ".."
    exit 1
}
Write-Host "      Schema aplicado ✓" -ForegroundColor Green

# -------------------------------------------
# 6. Ejecutar seed de datos
# -------------------------------------------
Write-Host "[6/7] Ejecutando seed de datos..." -ForegroundColor Yellow

npm run db:seed 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "      ADVERTENCIA: Seed falló (puede que los datos ya existan)" -ForegroundColor Yellow
} else {
    Write-Host "      Seed completado ✓" -ForegroundColor Green
}

Set-Location -Path ".."

# -------------------------------------------
# 7. Iniciar backend + frontend
# -------------------------------------------
Write-Host "[7/7] Iniciando backend + frontend..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SERVIDORES INICIADOS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Frontend:  http://localhost:5173" -ForegroundColor Green
Write-Host "  Backend:   http://localhost:3000" -ForegroundColor Green
Write-Host "  Database:  localhost:5434" -ForegroundColor Green
Write-Host ""
Write-Host "  Presiona Ctrl+C para detener todos los servicios" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

npm run dev
