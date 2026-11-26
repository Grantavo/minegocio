const bcrypt = require("bcryptjs");
const pool = require("./db");

async function crearAdmin() {
  const clave = process.argv[2];
  if (!clave) {
    console.log("Uso: node crear-admin.js TuClave");
    process.exit(1);
  }

  // El hash es la contraseña convertida en un texto irreversible
  const hash = await bcrypt.hash(clave, 10);

  await pool.query(
    `INSERT INTO usuarios (nombre_completo, correo, clave_hash, rol_id)
     VALUES ($1, $2, $3, (SELECT id FROM roles WHERE nombre = 'Administrador'))
     ON CONFLICT (correo) DO UPDATE SET clave_hash = EXCLUDED.clave_hash`,
    ["Administrador", "admin@minegocio.com", hash],
  );

  console.log("Administrador listo: admin@minegocio.com");
  await pool.end();
}

crearAdmin();
