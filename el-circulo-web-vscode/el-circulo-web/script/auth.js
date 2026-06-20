const ADMIN_ROLE_DEFAULT = "ADMIN";
const ADMIN_PASSWORD_DEFAULT = "123456789";
const ADMIN_SESSION_DURATION = 1000 * 60 * 60 * 8;

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

let konamiIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
  crearModalAdmin();
  configurarKonamiAdmin();
  activarAccesoMovilAdmin();
  validarSesionAdmin();
});

/* RUTAS */

function obtenerRutaPanel() {
  const path = window.location.pathname;

  if (path.includes("/pages/") || path.includes("/paginas/")) {
    return "panel.html";
  }

  return "pages/panel.html";
}

/* SESIÓN */

function validarSesionAdmin() {
  const rolActivo = localStorage.getItem("rolActivo");
  const loginTime = Number(localStorage.getItem("adminLoginTime") || 0);

  if (rolActivo !== "ADMIN") return;

  const ahora = Date.now();

  if (!loginTime || ahora - loginTime > ADMIN_SESSION_DURATION) {
    localStorage.removeItem("rolActivo");
    localStorage.removeItem("adminLoginTime");
    return;
  }

  activarOpcionesAdmin();
}

/* MODAL ADMIN CON ESTILO ORIGINAL */

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

  const btnCerrar = document.getElementById("cerrarLoginAdmin");
  const btnLogin = document.getElementById("btnLoginAdmin");
  const inputRol = document.getElementById("adminRol");
  const inputPassword = document.getElementById("adminPassword");

  if (btnCerrar) {
    btnCerrar.addEventListener("click", cerrarLoginAdmin);
  }

  if (btnLogin) {
    btnLogin.addEventListener("click", loginAdmin);
  }

  [inputRol, inputPassword].forEach((input) => {
    if (!input) return;

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        loginAdmin();
      }
    });
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      cerrarLoginAdmin();
    }
  });
}

function mostrarLoginAdmin() {
  const modal = document.getElementById("adminLoginModal");
  const mensaje = document.getElementById("adminLoginMensaje");
  const inputRol = document.getElementById("adminRol");
  const inputPassword = document.getElementById("adminPassword");

  if (!modal) return;

  modal.classList.add("show");
  modal.classList.add("active");
  document.body.classList.add("modal-open");

  if (mensaje) {
    mensaje.textContent = "";
    mensaje.className = "";
  }

  if (inputRol) inputRol.value = "";
  if (inputPassword) inputPassword.value = "";

  setTimeout(() => {
    if (inputRol) inputRol.focus();
  }, 150);
}

function cerrarLoginAdmin() {
  const modal = document.getElementById("adminLoginModal");

  if (!modal) return;

  modal.classList.remove("show");
  modal.classList.remove("active");
  document.body.classList.remove("modal-open");
}

/* CREDENCIALES */

async function obtenerCredencialesAdmin() {
  let credenciales = {
    usuario: ADMIN_ROLE_DEFAULT,
    password: ADMIN_PASSWORD_DEFAULT,
  };

  try {
    if (window.ElCirculoDataReady) {
      await window.ElCirculoDataReady;
    }

    if (window.ElCirculoData && window.ElCirculoData.getAdminCredenciales) {
      const guardadas = window.ElCirculoData.getAdminCredenciales();

      credenciales = {
        usuario: guardadas.usuario || ADMIN_ROLE_DEFAULT,
        password: guardadas.password || ADMIN_PASSWORD_DEFAULT,
      };
    }
  } catch (error) {
    console.warn("No se pudieron cargar credenciales personalizadas:", error);
  }

  return credenciales;
}

async function loginAdmin() {
  const rolInput = document.getElementById("adminRol");
  const passwordInput = document.getElementById("adminPassword");
  const mensaje = document.getElementById("adminLoginMensaje");

  if (!rolInput || !passwordInput || !mensaje) return;

  const rol = rolInput.value.trim().toUpperCase();
  const password = passwordInput.value.trim();

  const credenciales = await obtenerCredencialesAdmin();

  const usuarioCorrecto = String(
    credenciales.usuario || ADMIN_ROLE_DEFAULT
  ).toUpperCase();

  const passwordCorrecto = String(
    credenciales.password || ADMIN_PASSWORD_DEFAULT
  );

  if (rol === usuarioCorrecto && password === passwordCorrecto) {
    localStorage.setItem("rolActivo", "ADMIN");
    localStorage.setItem("adminLoginTime", Date.now());

    mensaje.textContent = "Acceso concedido. Bienvenido.";
    mensaje.className = "success";

    setTimeout(() => {
      window.location.href = obtenerRutaPanel();
    }, 700);
  } else {
    mensaje.textContent = "Acceso denegado. Credenciales incorrectas.";
    mensaje.className = "error";
  }
}

/* KONAMI DESKTOP */

function configurarKonamiAdmin() {
  document.addEventListener("keydown", (event) => {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    const expectedKey = KONAMI_CODE[konamiIndex];

    if (key === expectedKey) {
      konamiIndex++;

      if (konamiIndex === KONAMI_CODE.length) {
        konamiIndex = 0;
        mostrarLoginAdmin();
      }
    } else {
      konamiIndex = 0;
    }
  });
}

/* ACCESO MÓVIL: 3 TOQUES EN LOGO */

function activarAccesoMovilAdmin() {
  const brand = document.querySelector(".brand");
  const logo = document.querySelector(".brand-logo");
  const elemento = logo || brand;

  if (!elemento) return;

  const estaEnInicio = window.location.pathname.includes("inicio.html");

  let taps = 0;
  let timer = null;

  elemento.addEventListener("click", (event) => {
    if (!estaEnInicio) return;

    event.preventDefault();
    event.stopPropagation();

    taps++;

    clearTimeout(timer);

    timer = setTimeout(() => {
      taps = 0;
    }, 1200);

    if (taps >= 3) {
      clearTimeout(timer);
      taps = 0;
      mostrarLoginAdmin();
    }
  });
}

/* OPCIONES ADMIN EN MENÚ */

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

/* EXPONER FUNCIONES */

window.crearModalAdmin = crearModalAdmin;
window.mostrarLoginAdmin = mostrarLoginAdmin;
window.cerrarLoginAdmin = cerrarLoginAdmin;
window.loginAdmin = loginAdmin;
window.obtenerRutaPanel = obtenerRutaPanel;