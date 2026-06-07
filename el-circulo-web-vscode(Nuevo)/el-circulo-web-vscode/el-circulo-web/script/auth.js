const ADMIN_PASSWORD = "123456789";
const ADMIN_ROLE = "ADMIN";

const konamiCode = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a"
];

let konamiPosition = 0;

document.addEventListener("DOMContentLoaded", () => {
  crearModalAdmin();
  activarOpcionesAdmin();
  prepararEventosLogin();
});

document.addEventListener("keydown", (event) => {
  const tecla = event.key;

  if (tecla === konamiCode[konamiPosition]) {
    konamiPosition++;

    if (konamiPosition === konamiCode.length) {
      mostrarLoginAdmin();
      konamiPosition = 0;
    }
  } else {
    konamiPosition = 0;
  }
});

function crearModalAdmin() {
  if (document.getElementById("adminLoginModal")) return;

  const modal = document.createElement("div");

  modal.id = "adminLoginModal";
  modal.className = "admin-login-modal";

  modal.innerHTML = `
    <div class="admin-login-box">
      <button class="admin-close-btn" id="cerrarLoginAdmin">×</button>

      <div class="admin-login-header-clean">
        <div class="admin-access-image">
          <img src="../img/admin-shield.png" alt="Acceso administrativo">
        </div>

        <div>
          <h2>Panel administrativo</h2>
          <p>Acceso privado de El Círculo Gaming House</p>
        </div>
      </div>

      <label for="adminRol">Rol de acceso</label>
      <input 
        type="text" 
        id="adminRol" 
        placeholder="Ingresa tu rol de acceso" 
        autocomplete="off"
      >

      <label for="adminPassword">Clave maestra</label>
      <input 
        type="password" 
        id="adminPassword" 
        placeholder="Ingresa la clave de seguridad"
        autocomplete="off"
      >

      <button id="btnLoginAdmin" class="admin-unlock-btn">
        Ingresar al panel
      </button>

      <span id="adminLoginMensaje"></span>
    </div>
  `;

  document.body.appendChild(modal);
}

function prepararEventosLogin() {
  const btnLogin = document.getElementById("btnLoginAdmin");
  const btnCerrar = document.getElementById("cerrarLoginAdmin");

  if (btnLogin) {
    btnLogin.addEventListener("click", loginAdmin);
  }

  if (btnCerrar) {
    btnCerrar.addEventListener("click", cerrarLoginAdmin);
  }
}

function mostrarLoginAdmin() {
  const modal = document.getElementById("adminLoginModal");

  if (modal) {
    modal.classList.add("active");

    const inputRol = document.getElementById("adminRol");
    if (inputRol) inputRol.focus();
  }
}

function cerrarLoginAdmin() {
  const modal = document.getElementById("adminLoginModal");

  if (modal) {
    modal.classList.remove("active");
  }
}

function loginAdmin() {
  const rol = document.getElementById("adminRol").value.trim().toUpperCase();
  const password = document.getElementById("adminPassword").value.trim();
  const mensaje = document.getElementById("adminLoginMensaje");

  if (rol === ADMIN_ROLE && password === ADMIN_PASSWORD) {
    localStorage.setItem("rolActivo", "ADMIN");

    mensaje.textContent = "Acceso concedido. Bienvenido.";
    mensaje.className = "success";

    setTimeout(() => {
      window.location.href = obtenerRutaPanel();
    }, 900);
  } else {
    mensaje.textContent = "Acceso denegado. Credenciales incorrectas.";
    mensaje.className = "error";
  }
}

function obtenerRutaPanel() {
  const estaEnPaginas = window.location.pathname.includes("/paginas/");

  if (estaEnPaginas) {
    return "panel.html";
  }

  return "paginas/panel.html";
}

function activarOpcionesAdmin() {
  const rolActivo = localStorage.getItem("rolActivo");

  if (rolActivo !== "ADMIN") return;

  document.querySelectorAll(".admin-only").forEach(elemento => {
    elemento.style.display = "inline-flex";
  });

  if (document.getElementById("adminModeFloatingBtn")) return;

  const botonAdmin = document.createElement("a");
  botonAdmin.id = "adminModeFloatingBtn";
  botonAdmin.className = "admin-mode-floating-btn";
  botonAdmin.textContent = "Modo admin";
  botonAdmin.href = obtenerRutaPanel();

  document.body.appendChild(botonAdmin);
}