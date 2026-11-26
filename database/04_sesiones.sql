-- 04_sesiones.sql: tabla donde el servidor guarda las sesiones activas

CREATE TABLE IF NOT EXISTS sesiones (
  sid    VARCHAR NOT NULL PRIMARY KEY,
  sess   JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sesiones_expire ON sesiones (expire);