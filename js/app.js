// Busca el formulario del login (solo existe en login.html)
const formulario = document.getElementById("formLogin");

// Si estamos en el login, revisamos los campos al enviar el formulario
if (formulario) {
  formulario.addEventListener("submit", validarLogin);
}

// Revisa que usuario y contraseña no estén vacíos
function validarLogin(evento) {
  evento.preventDefault(); // evita que la página se recargue

  if (formulario.checkValidity() === false) {
    // Activa los mensajes de error de Bootstrap
    formulario.classList.add("was-validated");
    return;
  }

  // Por ahora no hay base de datos: pasa directo al escritorio
  window.location.href = "escritorio.html";
}
