-- 03_usuario_app.sql: usuario con permisos limitados para el backend

CREATE ROLE minegocio_app LOGIN PASSWORD 'TuClaveDeApp';

-- Puede conectarse a la base y ver el esquema public
GRANT CONNECT ON DATABASE minegocio TO minegocio_app;
GRANT USAGE ON SCHEMA public TO minegocio_app;

-- Puede leer y modificar filas de las tablas actuales
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO minegocio_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO minegocio_app;

-- Lo mismo para las tablas que crees más adelante
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO minegocio_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO minegocio_app;