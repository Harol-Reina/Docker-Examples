-- Script de inicialización para PostgreSQL
-- Este archivo se ejecuta automáticamente cuando se crea la base de datos

-- Crear extensiones útiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Mensaje de confirmación
SELECT 'Database initialized successfully!' AS message;
