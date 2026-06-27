-- ===========================================
-- SERVIBOT AI - Inicialización de PostgreSQL
-- ===========================================

-- Crear extensiones útiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Verificar conexión
SELECT 'SERVIBOT AI Database - Conexión exitosa' AS status;
