require("dotenv").config();
const express = require("express");
const session = require("express-session");
const PgSession = require("connect-pg-simple")(session);
const path = require("path");
const bcrypt = require("bcryptjs");
const pool = require("./db");

const app = express();
app.use(express.json());

// Sesiones guardadas en la tabla "sesiones" de PostgreSQL
app.use(
  session({
    store: new PgSession({ pool, tableName: "sesiones" }),
    secret: process.env.SESSION_SECRET,
    name: "minegocio.sid",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, // el JavaScript de la página no puede leer la cookie
      sameSite: "lax", // no se envía desde otros sitios en peticiones sospechosas
      maxAge: 8 * 60 * 60 * 1000, // la sesión dura 8 horas
    },
  }),
);

// --- Guardias ---
function exigirSesionPagina(req, res, next) {
  if (req.session.usuario) return next();
  res.redirect("/login.html");
}

function exigirSesionApi(req, res, next) {
  if (req.session.usuario) return next();
  res
    .status(401)
    .json({ error: "sin_sesion", mensaje: "Debe iniciar sesión." });
}

// Evita que el navegador guarde copias (arregla la flecha atrás/adelante)
function sinCache(req, res, next) {
  res.set("Cache-Control", "no-store");
  next();
}

// --- Páginas y archivos públicos ---
// Solo servimos carpetas concretas, nunca toda la raíz (ahí está backend/.env)
const raiz = path.join(__dirname, "..");
app.use("/css", express.static(path.join(raiz, "css")));
app.use("/js", express.static(path.join(raiz, "js")));
app.use("/lib", express.static(path.join(raiz, "lib")));

app.get("/", (req, res) => res.redirect("/login.html"));

app.get("/login.html", sinCache, (req, res) => {
  // Si ya hay sesión, no tiene sentido mostrar el login
  if (req.session.usuario) return res.redirect("/escritorio.html");
  res.sendFile(path.join(raiz, "login.html"));
});

app.get("/escritorio.html", sinCache, exigirSesionPagina, (req, res) => {
  res.sendFile(path.join(raiz, "escritorio.html"));
});

// --- API ---
app.post("/api/login", async (req, res) => {
  const { usuario, clave } = req.body;
  if (!usuario || !clave) {
    return res
      .status(400)
      .json({
        error: "datos_incompletos",
        mensaje: "Ingrese usuario y contraseña.",
      });
  }

  try {
    const r = await pool.query(
      `SELECT u.id, u.nombre_completo, u.correo, u.clave_hash, u.activo, r.nombre AS rol
       FROM usuarios u JOIN roles r ON r.id = u.rol_id
       WHERE LOWER(u.correo) = LOWER($1)`,
      [usuario],
    );
    const u = r.rows[0];
    const claveOk = u ? await bcrypt.compare(clave, u.clave_hash) : false;

    if (!claveOk) {
      return res.status(401).json({
        error: "credenciales_incorrectas",
        mensaje:
          "El usuario o la contraseña ingresados son incorrectos. Verifique sus datos e inténtelo nuevamente.",
      });
    }
    if (!u.activo) {
      return res.status(403).json({
        error: "cuenta_inactiva",
        mensaje:
          "Su cuenta se encuentra desactivada. Comuníquese con el administrador del sistema.",
      });
    }

    await pool.query(
      "UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = $1",
      [u.id],
    );

    const datosUsuario = {
      id: u.id,
      nombre: u.nombre_completo,
      correo: u.correo,
      rol: u.rol,
    };

    // regenerate crea un identificador de sesión nuevo al iniciar sesión,
    // para que nadie pueda reutilizar uno anterior
    req.session.regenerate((err) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({
            error: "error_servidor",
            mensaje: "Ocurrió un error en el servidor.",
          });
      }
      req.session.usuario = datosUsuario;
      res.json({ usuario: datosUsuario });
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        error: "error_servidor",
        mensaje: "Ocurrió un error en el servidor.",
      });
  }
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("minegocio.sid");
    res.json({ ok: true });
  });
});

// Ruta de ejemplo protegida: quién está conectado
app.get("/api/yo", exigirSesionApi, (req, res) => {
  res.json({ usuario: req.session.usuario });
});

const puerto = process.env.PORT || 3000;
app.listen(puerto, () => console.log(`Servidor en http://localhost:${puerto}`));
