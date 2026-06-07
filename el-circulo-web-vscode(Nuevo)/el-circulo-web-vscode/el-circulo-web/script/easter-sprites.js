/* ============================= */
/* EASTER EGG SPRITES - INICIO */
/* ============================= */

/*
  Primer código:
  A B → ← → ←

  Segundo código:
  ↓ ↓ ↑ ↑
*/

const codigoMisterio = [
  "a",
  "b",
  "arrowright",
  "arrowleft",
  "arrowright",
  "arrowleft"
];

const codigoCompletar = [
  "arrowdown",
  "arrowdown",
  "arrowup",
  "arrowup"
];

let posicionCodigoMisterio = 0;
let posicionCodigoCompletar = 0;

let modoMisterioActivo = false;
let modoFinalActivo = false;

let spritesActivos = [];
let animacionSpritesId = null;
let audioMisterio = null;

document.addEventListener("DOMContentLoaded", () => {
  prepararAudioMisterio();
});

document.addEventListener("keydown", (event) => {
  const tecla = event.key.toLowerCase();

  if (!modoMisterioActivo) {
    detectarCodigoMisterio(tecla);
    return;
  }

  if (modoMisterioActivo && !modoFinalActivo) {
    detectarCodigoCompletar(tecla);
  }
});

document.addEventListener("click", (event) => {
  if (!modoMisterioActivo) return;

  const link = event.target.closest("a");

  if (link) {
    event.preventDefault();
  }
});

/* ============================= */
/* DETECCIÓN DE CÓDIGOS */
/* ============================= */

function detectarCodigoMisterio(tecla) {
  if (tecla === codigoMisterio[posicionCodigoMisterio]) {
    posicionCodigoMisterio++;

    if (posicionCodigoMisterio === codigoMisterio.length) {
      activarModoMisterio();
      posicionCodigoMisterio = 0;
    }
  } else {
    posicionCodigoMisterio = 0;
  }
}

function detectarCodigoCompletar(tecla) {
  if (tecla === codigoCompletar[posicionCodigoCompletar]) {
    posicionCodigoCompletar++;

    if (posicionCodigoCompletar === codigoCompletar.length) {
      revelarBotonCelestial();
      posicionCodigoCompletar = 0;
    }
  } else {
    posicionCodigoCompletar = 0;
  }
}

/* ============================= */
/* AUDIO */
/* ============================= */

function prepararAudioMisterio() {
  audioMisterio = new Audio("../efectos/audio/misterio.mp3");
  audioMisterio.loop = true;
  audioMisterio.volume = 0.35;
}

function reproducirAudioMisterio() {
  if (!audioMisterio) return;

  audioMisterio.currentTime = 0;

  audioMisterio.play().catch(() => {
    console.log("El navegador bloqueó el audio hasta una interacción del usuario.");
  });
}

function detenerAudioMisterio() {
  if (!audioMisterio) return;

  audioMisterio.pause();
  audioMisterio.currentTime = 0;
}

function reproducirSonidoSalto(sprite) {
  if (!sprite.jumpSound) return;

  const audio = new Audio(sprite.jumpSound);
  audio.volume = 0.45;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

/* ============================= */
/* MODO MISTERIO */
/* ============================= */

function activarModoMisterio() {
  if (modoMisterioActivo) return;

  modoMisterioActivo = true;
  document.body.classList.add("modo-misterio");

  reproducirAudioMisterio();
  esconderNavegacion();
  animarLogoAbsorcion();

  setTimeout(() => {
    mostrarMensajeMisterioso("COMPLETA EL CÓDIGO");
  }, 900);
}

function esconderNavegacion() {
  const nav = document.querySelector(".nav-links");

  if (!nav) return;

  const links = nav.querySelectorAll("a");

  links.forEach((link) => {
    const x = `${Math.floor(Math.random() * 260 - 130)}px`;
    const y = `${Math.floor(Math.random() * -180 - 80)}px`;

    link.style.setProperty("--explode-x", x);
    link.style.setProperty("--explode-y", y);
  });

  nav.classList.add("easter-destruir");

  setTimeout(() => {
    nav.style.display = "none";
  }, 780);
}

function animarLogoAbsorcion() {
  const logoCard = document.querySelector(".logo-card");
  const heroLogo = document.querySelector(".hero-logo");

  if (logoCard) {
    logoCard.classList.add("easter-logo-absorbe");
  }

  if (heroLogo) {
    heroLogo.classList.add("easter-logo-absorbe");
  }
}

function mostrarMensajeMisterioso(texto) {
  eliminarElemento(".easter-mensaje");

  const mensaje = document.createElement("div");
  mensaje.className = "easter-mensaje";
  mensaje.textContent = texto;

  document.body.appendChild(mensaje);
}
function restaurarNavegacion() {
  const nav = document.querySelector(".nav-links");

  if (!nav) return;

  nav.style.display = "";
  nav.classList.remove("easter-destruir");

  nav.querySelectorAll("a").forEach((link) => {
    link.style.removeProperty("--explode-x");
    link.style.removeProperty("--explode-y");
  });
}
/* ============================= */
/* BOTÓN CELESTIAL */
/* ============================= */

function revelarBotonCelestial() {
  if (modoFinalActivo) return;

  modoFinalActivo = true;

  document.body.classList.remove("modo-misterio");
  detenerAudioMisterio();

restaurarNavegacion();

  const logoCard = document.querySelector(".logo-card");
  const heroLogo = document.querySelector(".hero-logo");

  if (logoCard) {
    logoCard.classList.remove("easter-logo-absorbe");
    logoCard.classList.add("easter-logo-divino");
  }

  if (heroLogo) {
    heroLogo.classList.remove("easter-logo-absorbe");
    heroLogo.classList.add("easter-logo-divino");
  }

  const boton = document.createElement("button");
  boton.className = "easter-divine-btn";
  boton.textContent = "LIBERAR SPRITES";

boton.addEventListener("click", () => {
  localStorage.setItem("modoSpritesActivo", "true");
  boton.remove();
  liberarSprites();
});

  document.body.appendChild(boton);
}

function liberarSprites() {
  const logo = document.querySelector(".hero-logo") || document.querySelector(".logo-card");

  if (logo) {
    logo.animate(
      [
        { transform: "translateX(0) scale(1)" },
        { transform: "translateX(-8px) scale(1.05)" },
        { transform: "translateX(8px) scale(1.05)" },
        { transform: "translateX(0) scale(1)" }
      ],
      {
        duration: 550,
        iterations: 2
      }
    );
  }

  setTimeout(() => {
    crearLluviaDeSprites();
    crearBotonReset();
  }, 650);
}

/* ============================= */
/* CREACIÓN DE SPRITES */
/* ============================= */

function obtenerSueloFooter() {
  const spriteFloor = document.getElementById("spriteFloor");

  if (!spriteFloor) {
    return window.innerHeight - 72;
  }

  return spriteFloor.clientHeight - 70;
}

function crearLluviaDeSprites() {
  const personajes = typeof SPRITE_CATALOG !== "undefined" ? SPRITE_CATALOG : [];

  if (personajes.length === 0) {
    console.warn("No hay personajes registrados en SPRITE_CATALOG.");
    return;
  }

  if (animacionSpritesId) {
    cancelAnimationFrame(animacionSpritesId);
    animacionSpritesId = null;
  }

  const cantidadPorPersonaje = 1;
  const suelo = obtenerSueloFooter();

  personajes.forEach((personaje, index) => {
    for (let i = 0; i < cantidadPorPersonaje; i++) {
      const tipoMovimiento = personaje.tipoMovimiento || "suelo";
      const direccion = index % 2 === 0 ? 1 : -1;

      const sprite = document.createElement("img");

      sprite.src = personaje.walk;
sprite.className = tipoMovimiento === "volador"
  ? "easter-sprite walking volador"
  : "easter-sprite walking ground";

      sprite.draggable = false;
      sprite.alt = personaje.nombre || personaje.id;

      sprite.style.width = `${personaje.width || 64}px`;
      sprite.style.height = `${personaje.height || 64}px`;

      const inicioX = obtenerCentroLogoX() + numeroAleatorio(-80, 80);
      const inicioY = obtenerCentroLogoY() + numeroAleatorio(-40, 30);

      sprite.style.left = `${inicioX}px`;
      sprite.style.top = `${inicioY}px`;

      const spriteFloor = document.getElementById("spriteFloor");

if (tipoMovimiento === "volador") {
  document.body.appendChild(sprite);
} else {
  if (spriteFloor) {
    spriteFloor.appendChild(sprite);
  } else {
    document.body.appendChild(sprite);
  }
}

      spritesActivos.push({
        id: personaje.id,
        nombre: personaje.nombre || personaje.id,

        walk: personaje.walk,
        jump: personaje.jump || null,
        jumpSound: personaje.jumpSound || null,

        elemento: sprite,

        x: inicioX,
        y: inicioY,

        width: personaje.width || 64,
        height: personaje.height || 64,

        vx: tipoMovimiento === "volador"
          ? (personaje.speed || 2) * direccion
          : numeroAleatorio(4, 8) * direccion,

        vy: tipoMovimiento === "volador"
          ? numeroAleatorio(-2, 2)
          : numeroAleatorio(-15, -9),

        speed: personaje.speed || 1.5,
        jumpPower: personaje.jumpPower || -12,

        suelo: tipoMovimiento === "volador" ? null : suelo,
        direccion,
        direccionAntesDelSalto: direccion,

        enSuelo: false,
        saltando: false,
        cooldownSalto: 0,

        tipoMovimiento,
        saltaSobreOtros: Boolean(personaje.saltaSobreOtros)
      });
    }
  });

  iniciarFisicaSprites();
}

function obtenerCentroLogoX() {
  const logo = document.querySelector(".hero-logo") || document.querySelector(".logo-card");

  if (!logo) {
    return window.innerWidth / 2;
  }

  const rect = logo.getBoundingClientRect();

  return rect.left + rect.width / 2;
}

function obtenerCentroLogoY() {
  const logo = document.querySelector(".hero-logo") || document.querySelector(".logo-card");

  if (!logo) {
    return 160;
  }

  const rect = logo.getBoundingClientRect();

  return rect.top + rect.height / 2;
}

/* ============================= */
/* LOOP DE FÍSICA */
/* ============================= */

function iniciarFisicaSprites() {
  const gravedad = 0.55;
  const reboteSuelo = -0.28;
  const friccionAire = 0.992;

  function actualizar() {
    spritesActivos.forEach((sprite) => {
      if (sprite.tipoMovimiento === "volador") {
        aplicarFisicaVolador(sprite);
        detectarBordesVolador(sprite);
      } else {
        aplicarFisicaBasica(sprite, gravedad, reboteSuelo, friccionAire);
        detectarBordes(sprite);
      }
    });

    detectarSaltosPreventivos();
    detectarColisionesEntreSprites();

    spritesActivos.forEach((sprite) => {
      actualizarSpriteVisual(sprite);
    });

    animacionSpritesId = requestAnimationFrame(actualizar);
  }

  actualizar();
}

/* ============================= */
/* FÍSICA DE SUELO */
/* ============================= */

function aplicarFisicaBasica(sprite, gravedad, reboteSuelo, friccionAire) {
  sprite.vy += gravedad;

  sprite.x += sprite.vx;
  sprite.y += sprite.vy;

  sprite.vx *= friccionAire;

  if (sprite.y >= sprite.suelo) {
    sprite.y = sprite.suelo;

    if (Math.abs(sprite.vy) > 2) {
      sprite.vy *= reboteSuelo;
    } else {
      sprite.vy = 0;
    }

    sprite.enSuelo = true;

    if (sprite.saltando && Math.abs(sprite.vy) < 1) {
      volverACaminar(sprite);
    }
  } else {
    sprite.enSuelo = false;
  }

  if (sprite.enSuelo && !sprite.saltando) {
    sprite.vx = sprite.speed * sprite.direccion;
  }

  if (sprite.cooldownSalto > 0) {
    sprite.cooldownSalto--;
  }
}

function detectarBordes(sprite) {
  const limiteIzquierdo = 0;
  const limiteDerecho = window.innerWidth - sprite.width;

  if (sprite.x <= limiteIzquierdo) {
    sprite.x = limiteIzquierdo;
    sprite.direccion = 1;
    sprite.vx = sprite.speed;
  }

  if (sprite.x >= limiteDerecho) {
    sprite.x = limiteDerecho;
    sprite.direccion = -1;
    sprite.vx = -sprite.speed;
  }
}

/* ============================= */
/* FÍSICA DE VOLADORES */
/* ============================= */

function aplicarFisicaVolador(sprite) {
  sprite.x += sprite.vx;
  sprite.y += sprite.vy;

  sprite.y += Math.sin(Date.now() / 250 + sprite.x * 0.01) * 0.35;

  if (Math.abs(sprite.vx) < 0.5) {
    sprite.vx = sprite.speed * sprite.direccion;
  }

  if (Math.abs(sprite.vy) < 0.25) {
    sprite.vy = numeroAleatorio(-1.4, 1.4);
  }

  sprite.enSuelo = false;
  sprite.saltando = false;
}

function detectarBordesVolador(sprite) {
  const limiteIzquierdo = 0;
  const limiteDerecho = window.innerWidth - sprite.width;
  const limiteSuperior = 80;
  const limiteInferior = window.innerHeight - sprite.height - 80;

  if (sprite.x <= limiteIzquierdo) {
    sprite.x = limiteIzquierdo;
    sprite.vx = Math.abs(sprite.speed);
    sprite.direccion = 1;
  }

  if (sprite.x >= limiteDerecho) {
    sprite.x = limiteDerecho;
    sprite.vx = -Math.abs(sprite.speed);
    sprite.direccion = -1;
  }

  if (sprite.y <= limiteSuperior) {
    sprite.y = limiteSuperior;
    sprite.vy = Math.abs(sprite.speed * 0.8);
  }

  if (sprite.y >= limiteInferior) {
    sprite.y = limiteInferior;
    sprite.vy = -Math.abs(sprite.speed * 0.8);
  }
}

/* ============================= */
/* SALTOS Y COLISIONES */
/* ============================= */

function detectarSaltosPreventivos() {
  spritesActivos.forEach((sprite) => {
    if (!sprite.saltaSobreOtros) return;
    if (!sprite.enSuelo) return;
    if (sprite.cooldownSalto > 0) return;

    const distanciaDeteccion = 42;

    spritesActivos.forEach((otroSprite) => {
      if (sprite === otroSprite) return;
      if (otroSprite.tipoMovimiento === "volador") return;

      const vaALaDerecha = sprite.direccion > 0;

      const frenteSprite = vaALaDerecha
        ? sprite.x + sprite.width
        : sprite.x;

      const bordeOtro = vaALaDerecha
        ? otroSprite.x
        : otroSprite.x + otroSprite.width;

      const distanciaHorizontal = vaALaDerecha
        ? bordeOtro - frenteSprite
        : frenteSprite - bordeOtro;

      const estanEnLaMismaAltura =
        Math.abs((sprite.y + sprite.height) - (otroSprite.y + otroSprite.height)) < 28;

      const estaEnFrente =
        distanciaHorizontal > 0 &&
        distanciaHorizontal < distanciaDeteccion;

      if (estaEnFrente && estanEnLaMismaAltura) {
        hacerSaltarSprite(sprite, true);
      }
    });
  });
}

function detectarColisionesEntreSprites() {
  for (let i = 0; i < spritesActivos.length; i++) {
    for (let j = i + 1; j < spritesActivos.length; j++) {
      const spriteA = spritesActivos[i];
      const spriteB = spritesActivos[j];

      if (hayColision(spriteA, spriteB)) {
        resolverColisionSprites(spriteA, spriteB);
      }
    }
  }
}

function hayColision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function resolverColisionSprites(spriteA, spriteB) {
  if (spriteA.tipoMovimiento === "volador" || spriteB.tipoMovimiento === "volador") {
    resolverColisionConVolador(spriteA, spriteB);
    return;
  }

  const spriteSaltador = obtenerSpriteSaltador(spriteA, spriteB);

  if (spriteSaltador) {
    resolverColisionConSalto(spriteSaltador, spriteA, spriteB);
    return;
  }

  resolverColisionNormal(spriteA, spriteB);
}

function resolverColisionConVolador(spriteA, spriteB) {
  const centroA = {
    x: spriteA.x + spriteA.width / 2,
    y: spriteA.y + spriteA.height / 2
  };

  const centroB = {
    x: spriteB.x + spriteB.width / 2,
    y: spriteB.y + spriteB.height / 2
  };

  const dx = centroA.x - centroB.x;
  const dy = centroA.y - centroB.y;

  if (spriteA.tipoMovimiento === "volador") {
    spriteA.vx = dx >= 0 ? Math.abs(spriteA.speed) : -Math.abs(spriteA.speed);
    spriteA.vy = dy >= 0 ? Math.abs(spriteA.speed * 0.8) : -Math.abs(spriteA.speed * 0.8);
    spriteA.direccion = spriteA.vx >= 0 ? 1 : -1;
  }

  if (spriteB.tipoMovimiento === "volador") {
    spriteB.vx = dx >= 0 ? -Math.abs(spriteB.speed) : Math.abs(spriteB.speed);
    spriteB.vy = dy >= 0 ? -Math.abs(spriteB.speed * 0.8) : Math.abs(spriteB.speed * 0.8);
    spriteB.direccion = spriteB.vx >= 0 ? 1 : -1;
  }

  if (spriteA.tipoMovimiento !== "volador") {
    spriteA.x += dx >= 0 ? 4 : -4;
  }

  if (spriteB.tipoMovimiento !== "volador") {
    spriteB.x += dx >= 0 ? -4 : 4;
  }
}

function obtenerSpriteSaltador(spriteA, spriteB) {
  if (spriteA.saltaSobreOtros) return spriteA;
  if (spriteB.saltaSobreOtros) return spriteB;

  return null;
}

function resolverColisionConSalto(spriteSaltador, spriteA, spriteB) {
  const otroSprite = spriteSaltador === spriteA ? spriteB : spriteA;

  const saltadorArriba =
    spriteSaltador.y + spriteSaltador.height < otroSprite.y + otroSprite.height * 0.65;

  if (spriteSaltador.saltando || !spriteSaltador.enSuelo || saltadorArriba) {
    spriteSaltador.vx = spriteSaltador.speed * spriteSaltador.direccion;
    return;
  }

  hacerSaltarSprite(spriteSaltador, true);

  spriteSaltador.vx = spriteSaltador.speed * spriteSaltador.direccion * 1.35;

  if (spriteSaltador.direccion > 0) {
    spriteSaltador.x -= 3;
  } else {
    spriteSaltador.x += 3;
  }
}

function resolverColisionNormal(spriteA, spriteB) {
  const centroA = spriteA.x + spriteA.width / 2;
  const centroB = spriteB.x + spriteB.width / 2;

  if (centroA < centroB) {
    spriteA.x -= 4;
    spriteB.x += 4;

    spriteA.direccion = -1;
    spriteB.direccion = 1;
  } else {
    spriteA.x += 4;
    spriteB.x -= 4;

    spriteA.direccion = 1;
    spriteB.direccion = -1;
  }

  spriteA.vx = spriteA.speed * spriteA.direccion;
  spriteB.vx = spriteB.speed * spriteB.direccion;
}

/* ============================= */
/* SALTO */
/* ============================= */

function hacerSaltarSprite(sprite, mantenerDireccion = false) {
  if (!sprite.enSuelo) return;
  if (sprite.cooldownSalto > 0) return;

  if (mantenerDireccion) {
    sprite.direccionAntesDelSalto = sprite.direccion;
  }

  sprite.saltando = true;
  sprite.enSuelo = false;
  sprite.cooldownSalto = 80;

  sprite.vy = sprite.jumpPower;
  sprite.vx = sprite.speed * sprite.direccion * 1.35;

  reproducirSonidoSalto(sprite);

  if (sprite.jump) {
    sprite.elemento.src = sprite.jump;
  }

  sprite.elemento.classList.remove("walking");
  sprite.elemento.classList.add("jumping");
}

function volverACaminar(sprite) {
  sprite.saltando = false;

  if (sprite.direccionAntesDelSalto) {
    sprite.direccion = sprite.direccionAntesDelSalto;
  }

  sprite.vx = sprite.speed * sprite.direccion;

  if (sprite.walk) {
    sprite.elemento.src = sprite.walk;
  }

  sprite.elemento.classList.remove("jumping");
  sprite.elemento.classList.add("walking");
}

/* ============================= */
/* VISUAL */
/* ============================= */

function actualizarSpriteVisual(sprite) {
  sprite.elemento.style.left = `${sprite.x}px`;
  sprite.elemento.style.top = `${sprite.y}px`;

  const direccionVisual = sprite.direccion < 0 ? -1 : 1;

  sprite.elemento.style.setProperty("--dir", direccionVisual);
}

/* ============================= */
/* RESET */
/* ============================= */

function crearBotonReset() {
  if (document.querySelector(".easter-reset-btn")) return;

  const boton = document.createElement("button");
  boton.className = "easter-reset-btn";
  boton.textContent = "×";
  boton.title = "Restaurar página";

  boton.addEventListener("click", restaurarTodo);

  document.body.appendChild(boton);
}
function restaurarTodo() {
  localStorage.removeItem("modoSpritesActivo");

  detenerAudioMisterio();

  document.body.classList.remove("modo-misterio");

  modoMisterioActivo = false;
  modoFinalActivo = false;
  posicionCodigoMisterio = 0;
  posicionCodigoCompletar = 0;

  restaurarNavegacion();

  eliminarElemento(".easter-mensaje");
  eliminarElemento(".easter-divine-btn");
  eliminarElemento(".easter-reset-btn");

  spritesActivos.forEach((sprite) => {
    sprite.elemento.remove();
  });

  spritesActivos = [];

  if (animacionSpritesId) {
    cancelAnimationFrame(animacionSpritesId);
    animacionSpritesId = null;
  }
}

/* ============================= */
/* UTILIDADES */
/* ============================= */

function eliminarElemento(selector) {
  const elemento = document.querySelector(selector);

  if (elemento) {
    elemento.remove();
  }
}

function numeroAleatorio(min, max) {
  return Math.random() * (max - min) + min;
}

window.addEventListener("resize", () => {
  const nuevoSuelo = obtenerSueloFooter();

  spritesActivos.forEach((sprite) => {
    if (sprite.tipoMovimiento !== "volador") {
      sprite.suelo = nuevoSuelo;
    }
  });
});