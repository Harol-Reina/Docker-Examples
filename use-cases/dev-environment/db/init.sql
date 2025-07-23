-- Script de inicialización para la base de datos de desarrollo

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de tareas
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos de prueba
INSERT INTO users (name, email) VALUES 
    ('Desarrollador 1', 'dev1@example.com'),
    ('Desarrollador 2', 'dev2@example.com'),
    ('Tester', 'tester@example.com')
ON CONFLICT (email) DO NOTHING;

INSERT INTO tasks (title, description, completed, user_id) VALUES 
    ('Configurar entorno Docker', 'Configurar Docker Compose con hot reload', true, 1),
    ('Implementar API REST', 'Crear endpoints básicos para CRUD', true, 1),
    ('Agregar base de datos', 'Configurar PostgreSQL en desarrollo', true, 2),
    ('Configurar debugging', 'Habilitar debugging remoto', false, 2),
    ('Escribir tests', 'Implementar tests unitarios', false, 3),
    ('Documentar API', 'Crear documentación de endpoints', false, 1);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Función para actualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar timestamp automáticamente
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at 
    BEFORE UPDATE ON tasks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
