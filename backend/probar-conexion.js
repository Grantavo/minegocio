const pool = require("./db");

async function probar() {
  try {
    const resultado = await pool.query("SELECT nombre FROM roles ORDER BY id");
    console.log("Conexión correcta. Roles encontrados:");
    resultado.rows.forEach((fila) => console.log(" -", fila.nombre));
  } catch (error) {
    console.error("No se pudo conectar:", error.message);
  } finally {
    await pool.end();
  }
}

probar();
