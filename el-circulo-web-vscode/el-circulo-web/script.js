/* =========================================================
   VARIABLES GENERALES
========================================================= */

const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");
const modalClose = document.getElementById("modalClose");

const menuToggle = document.getElementById("menuToggle");
const menuPanel = document.getElementById("menuPanel");

/*
  Excluimos .brand para que el logo del header
  no interfiera con la navegación ni con el easter egg.
*/
const links = document.querySelectorAll("a[href]:not(.brand)");

/* =========================================================
   MODAL GENERAL
========================================================= */

function openModal(content) {
  if (!modal || !modalContent) return;

  modalContent.innerHTML = content;
  modal.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  if (!modal) return;

  modal.classList.remove("show");
  document.body.style.overflow = "";
}

if (modalClose) {
  modalClose.addEventListener("click", closeModal);
}

if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal && modal.classList.contains("show")) {
    closeModal();
  }
});

/* =========================================================
   MENÚ HAMBURGUESA NEÓN
========================================================= */

if (menuToggle && menuPanel) {
  menuToggle.addEventListener("click", function (e) {
    e.stopPropagation();

    menuToggle.classList.toggle("open");
    menuPanel.classList.toggle("show");
  });

  menuPanel.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  document.addEventListener("click", function () {
    menuToggle.classList.remove("open");
    menuPanel.classList.remove("show");
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      menuToggle.classList.remove("open");
      menuPanel.classList.remove("show");
    }
  });

  const paginaActual = window.location.pathname.split("/").pop();
  const menuLinks = document.querySelectorAll(".menu-panel a");

  menuLinks.forEach(function (link) {
    const paginaLink = link.getAttribute("href");

    if (paginaActual === paginaLink) {
      link.classList.add("active-page");
    }
  });
}

/* =========================================================
   TRANSICIÓN NEON ENTRE PÁGINAS
========================================================= */

function playNeonTransitionToPage(url) {
  const overlay = document.createElement("div");

  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.background = "rgba(0, 0, 0, 0.18)";
  overlay.style.backdropFilter = "blur(2px)";
  overlay.style.webkitBackdropFilter = "blur(2px)";
  overlay.style.zIndex = "99999";
  overlay.style.pointerEvents = "none";
  overlay.style.overflow = "hidden";
  overlay.style.opacity = "0";
  overlay.style.transition = "opacity 0.12s ease";

  const scanLine = document.createElement("div");

  scanLine.style.position = "absolute";
  scanLine.style.left = "0";
  scanLine.style.top = "-18%";
  scanLine.style.width = "100%";
  scanLine.style.height = "18%";
  scanLine.style.background = `
    linear-gradient(
      90deg,
      rgba(51, 217, 255, 0.00) 0%,
      rgba(51, 217, 255, 0.95) 30%,
      rgba(109, 255, 71, 0.95) 70%,
      rgba(109, 255, 71, 0.00) 100%
    )
  `;
  scanLine.style.filter = "blur(10px)";
  scanLine.style.boxShadow = `
    0 0 30px rgba(51, 217, 255, 0.55),
    0 0 45px rgba(109, 255, 71, 0.35)
  `;
  scanLine.style.transform = "skewY(-2deg)";

  const glow = document.createElement("div");

  glow.style.position = "absolute";
  glow.style.inset = "0";
  glow.style.background = `
    radial-gradient(
      circle at center,
      rgba(51, 217, 255, 0.14) 0%,
      rgba(109, 255, 71, 0.10) 22%,
      rgba(0, 0, 0, 0) 65%
    )
  `;
  glow.style.opacity = "0.9";

  overlay.appendChild(glow);
  overlay.appendChild(scanLine);
  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    overlay.style.opacity = "1";
  });

  let start = null;
  const duration = 420;

  function animate(timestamp) {
    if (!start) start = timestamp;

    const progress = Math.min((timestamp - start) / duration, 1);
    const topPercent = -18 + progress * 136;

    scanLine.style.top = `${topPercent}%`;

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);

  setTimeout(() => {
    window.location.href = url;
  }, 480);
}

links.forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");

    if (!href) return;

    if (
      href === "#" ||
      href.startsWith("#") ||
      href.startsWith("http") ||
      href.startsWith("tel:") ||
      href.startsWith("mailto:")
    ) {
      return;
    }

    e.preventDefault();

    if (menuPanel) {
      menuPanel.classList.remove("show");
    }

    if (menuToggle) {
      menuToggle.classList.remove("open");
    }

    playNeonTransitionToPage(href);
  });
});

/* =========================================================
   EASTER EGG:
   3 clics en el logo grande del cuadro de inicio
========================================================= */

const heroLogo = document.querySelector(".hero-logo");
const heroSection = document.querySelector(".hero");
const heroGrid = document.querySelector(".hero-grid") || document.querySelector(".home-hero-layout");

let logoClickCount = 0;
let logoClickTimer = null;
let secretActivated = false;

const bombImagePath = "../img/bombainactiva.png";
const flameGifPath = "../img/flama.gif";

function showPermanentBomb() {
  if (!heroGrid) return;

  let bomb = document.getElementById("heroSecretBomb");

  if (!bomb) {
    bomb = document.createElement("div");
    bomb.id = "heroSecretBomb";
    bomb.className = "hero-secret-bomb";

    bomb.innerHTML = `
      <div class="hero-secret-bomb-aura"></div>
      <img src="${bombImagePath}" alt="Bomba 8 bits" class="hero-secret-bomb-img">
    `;

    heroGrid.appendChild(bomb);
  }

  requestAnimationFrame(() => {
    bomb.classList.add("show");
  });
}

function showPermanentFlame() {
  if (!heroSection) return;

  let flame = document.getElementById("heroSecretFlame");

  if (!flame) {
    flame = document.createElement("div");
    flame.id = "heroSecretFlame";
    flame.className = "hero-secret-flame";

    flame.innerHTML = `
      <div class="hero-secret-flame-aura"></div>
      <img src="${flameGifPath}" alt="Flama 8 bits" class="hero-secret-flame-img">
    `;

    heroSection.appendChild(flame);
  }

  requestAnimationFrame(() => {
    flame.classList.add("show");
  });
}

function triggerLogoSecret() {
  if (secretActivated) return;

  secretActivated = true;
  showPermanentBomb();
  showPermanentFlame();
}

function handleLogoTripleClick(e) {
  e.preventDefault();
  e.stopPropagation();

  logoClickCount++;
  clearTimeout(logoClickTimer);

  if (logoClickCount === 3) {
    logoClickCount = 0;
    triggerLogoSecret();
    return;
  }

  logoClickTimer = setTimeout(() => {
    logoClickCount = 0;
  }, 900);
}

if (heroLogo) {
  heroLogo.style.cursor = "pointer";
  heroLogo.title = "Haz triple clic";
  heroLogo.addEventListener("click", handleLogoTripleClick);
}