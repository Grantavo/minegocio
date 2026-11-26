// Busca el formulario del login (solo existe en login.html)
const formulario = document.getElementById("formLogin");

// Si estamos en el login, revisamos los campos al enviar el formulario
if (formulario) {
  formulario.addEventListener("submit", validarLogin);
}

// Valida el login enviando los datos al servidor y mostrando mensajes de error
async function validarLogin(evento) {
  evento.preventDefault();

  const aviso = document.getElementById("mensajeLogin");
  aviso.className = "alert d-none";

  if (formulario.checkValidity() === false) {
    formulario.classList.add("was-validated");
    return;
  }

  try {
    const respuesta = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuario: document.getElementById("usuario").value.trim(),
        clave: document.getElementById("clave").value,
      }),
    });
    const datos = await respuesta.json();

    if (respuesta.ok) {
      sessionStorage.setItem("usuario", JSON.stringify(datos.usuario));
      window.location.href = "escritorio.html";
      return;
    }

    const inactiva = datos.error === "cuenta_inactiva";
    aviso.className = "alert " + (inactiva ? "alert-warning" : "alert-danger");
    document.getElementById("avisoTitulo").textContent = inactiva
      ? "Cuenta inactiva"
      : "No fue posible iniciar sesión";
    document.getElementById("avisoTexto").textContent = datos.mensaje;
  } catch (error) {
    aviso.className = "alert alert-danger";
    document.getElementById("avisoTitulo").textContent = "Sin conexión";
    document.getElementById("avisoTexto").textContent =
      "No se pudo contactar al servidor.";
  }
}

// Cerrar sesión (solo existe en escritorio.html)
const btnCerrarSesion = document.getElementById("btnCerrarSesion");

if (btnCerrarSesion) {
  btnCerrarSesion.addEventListener("click", async (evento) => {
    evento.preventDefault();
    try {
      await fetch("/api/logout", { method: "POST" });
    } finally {
      sessionStorage.removeItem("usuario");
      window.location.href = "login.html";
    }
  });
}

// Muestra el nombre del usuario conectado
const nombreUsuario = document.getElementById("nombreUsuario");

if (nombreUsuario) {
  fetch("/api/yo")
    .then((respuesta) => (respuesta.ok ? respuesta.json() : Promise.reject()))
    .then((datos) => {
      nombreUsuario.textContent = datos.usuario.nombre;
    })
    .catch(() => {
      window.location.href = "login.html";
    });
}
