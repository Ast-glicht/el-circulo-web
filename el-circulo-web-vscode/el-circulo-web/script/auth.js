const ADMIN_PASSWORD = "123456789";
const ADMIN_ROLE = "ADMIN";
verificarExpiracionAdmin();
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
  activarAccesoMovilAdmin();
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

function activarAccesoMovilAdmin() {
  const elemento = document.querySelector(".brand-logo") || document.querySelector(".brand");

  if (!elemento) return;

  let taps = 0;
  let timer = null;

  elemento.addEventListener("click", (event) => {
    taps++;

    clearTimeout(timer);

    timer = setTimeout(() => {
      taps = 0;
    }, 2000);

    if (taps >= 7) {
      event.preventDefault();
      taps = 0;
      mostrarLoginAdmin();
    }
  });
}

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
localStorage.setItem("adminLoginTime", Date.now());
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

  document.querySelectorAll(".admin-only").forEach((elemento) => {
    elemento.style.display = "inline-flex";
  });

  const menuPanel = document.getElementById("menuPanel");

  if (menuPanel && !document.getElementById("adminMenuPanelBtn")) {
    const botonAdmin = document.createElement("a");
    botonAdmin.id = "adminMenuPanelBtn";
    botonAdmin.className = "admin-menu-option";
    botonAdmin.textContent = "Modo admin";
    botonAdmin.href = obtenerRutaPanel();

    menuPanel.appendChild(botonAdmin);
  }

  if (menuPanel && !document.getElementById("adminMenuLogoutBtn")) {
    const botonSalir = document.createElement("button");
    botonSalir.id = "adminMenuLogoutBtn";
    botonSalir.className = "admin-menu-option admin-menu-logout";
    botonSalir.textContent = "Cerrar sesión";

    botonSalir.addEventListener("click", () => {
      localStorage.removeItem("rolActivo");
      localStorage.removeItem("adminLoginTime");
      window.location.href = "inicio.html";
    });

    menuPanel.appendChild(botonSalir);
  }
}

function verificarExpiracionAdmin() {
  const loginTime = Number(localStorage.getItem("adminLoginTime"));

  if (loginTime && Date.now() - loginTime > 4 * 60 * 60 * 1000) {
    localStorage.removeItem("rolActivo");
    localStorage.removeItem("adminLoginTime");
  }
}