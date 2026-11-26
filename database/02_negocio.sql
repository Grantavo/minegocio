-- 02_negocio.sql: datos generales del establecimiento

CREATE TABLE IF NOT EXISTS negocio (
  id               INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  nombre_comercial VARCHAR(120) NOT NULL,
  nit              VARCHAR(30)  NOT NULL,
  telefono         VARCHAR(30)  NOT NULL,
  correo           VARCHAR(120) NOT NULL,
  direccion        VARCHAR(200) NOT NULL,
  ciudad           VARCHAR(100) NOT NULL,
  descripcion      TEXT,
  logo_ruta        TEXT,
  actualizado_en   TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO negocio (nombre_comercial, nit, telefono, correo, direccion, ciudad)
VALUES ('MiNegocio S.A.S.', '901234567-8', '+57 312 345 6789',
        'contacto@minegocio.com', 'Calle 123 # 45 - 67', 'Bogotá, D.C.')
ON CONFLICT (id) DO NOTHING;
