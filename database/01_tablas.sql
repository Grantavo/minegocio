-- 01_tablas.sql: estructura inicial de MiNegocio

CREATE TABLE IF NOT EXISTS roles (
  id     SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS usuarios (
  id              SERIAL PRIMARY KEY,
  nombre_completo VARCHAR(120) NOT NULL,
  correo          VARCHAR(120) NOT NULL UNIQUE,
  telefono        VARCHAR(30),
  clave_hash      TEXT NOT NULL,
  rol_id          INTEGER NOT NULL REFERENCES roles(id),
  activo          BOOLEAN NOT NULL DEFAULT TRUE,
  ultimo_acceso   TIMESTAMP
);

INSERT INTO roles (nombre) VALUES
  ('Administrador'), ('Financiero'), ('Ventas'), ('Inventario')
ON CONFLICT (nombre) DO NOTHING;
