const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const clearSaved = document.getElementById("clearSaved");

const CORREO_NEGOCIO = "osoriocorteza@gmail.com";

function renderContactoPublico() {
  const contacto = window.ElCirculoData.getContacto();

  const cards = document.querySelectorAll(".contact-card");

  if (cards[0]) {
    cards[0].innerHTML = `
      <h3>Facebook</h3>
      <p><a href="${contacto.facebookUrl}" target="_blank">${contacto.facebookTexto}</a></p>
    `;
  }

  if (cards[1]) {
    cards[1].innerHTML = `
      <h3>Instagram</h3>
      <p><a href="${contacto.instagramUrl}" target="_blank">${contacto.instagramTexto}</a></p>
    `;
  }

  if (cards[2]) {
    cards[2].innerHTML = `
      <h3>Teléfono</h3>
      <p><a href="tel:${contacto.telefonoUrl}">${contacto.telefonoTexto}</a></p>
    `;
  }

  if (cards[3]) {
    cards[3].innerHTML = `
      <h3>Dirección</h3>
      <p>${contacto.direccion}</p>
    `;
  }

  const mapa = document.querySelector(".map-card iframe");

  if (mapa) {
    mapa.src = contacto.mapaUrl;
  }
}

function saveLastMessage(data) {
  localStorage.setItem("elcirculo-contacto", JSON.stringify(data));
}

function loadLastMessage() {
  const saved = localStorage.getItem("elcirculo-contacto");

  if (!saved) return;

  const data = JSON.parse(saved);

  ["name", "email", "phone", "message"].forEach((field) => {
    const input = document.getElementById(field);

    if (input && data[field]) {
      input.value = data[field];
    }
  });

  if (formStatus) {
    formStatus.textContent = "Se cargó el último mensaje guardado en este navegador.";
  }
}

function abrirGmailConMensaje(data) {
  const asunto = `Mensaje desde la página web - ${data.name}`;

  const cuerpo = `
Hola, soy ${data.name}.

Correo del cliente:
${data.email}

Teléfono:
${data.phone || "No indicado"}

Mensaje:
${data.message}

-------------------------
Mensaje enviado desde el formulario de contacto de El Círculo Gaming House.
  `.trim();

  const gmailUrl =
    `https://mail.google.com/mail/?view=cm&fs=1` +
    `&to=${encodeURIComponent(CORREO_NEGOCIO)}` +
    `&su=${encodeURIComponent(asunto)}` +
    `&body=${encodeURIComponent(cuerpo)}`;

  window.open(gmailUrl, "_blank");
}

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(contactForm).entries());

    data.name = String(data.name || "").trim();
    data.email = String(data.email || "").trim();
    data.phone = String(data.phone || "").trim();
    data.message = String(data.message || "").trim();

    if (data.name.length < 3) {
      formStatus.textContent = "Escribe un nombre válido.";
      return;
    }

    if (!data.email.includes("@") || !data.email.includes(".")) {
      formStatus.textContent = "Escribe un correo electrónico válido.";
      return;
    }

    if (data.message.length < 10) {
      formStatus.textContent = "El mensaje debe tener al menos 10 caracteres.";
      return;
    }

    saveLastMessage(data);

    formStatus.textContent = "Abriendo Gmail para enviar el mensaje al correo del negocio...";

    abrirGmailConMensaje(data);

    setTimeout(() => {
      contactForm.reset();
      formStatus.textContent = "Mensaje preparado en Gmail. Solo debes presionar Enviar.";
    }, 800);
  });
}

if (clearSaved) {
  clearSaved.addEventListener("click", () => {
    localStorage.removeItem("elcirculo-contacto");

    if (formStatus) {
      formStatus.textContent = "Guardado local eliminado.";
    }

    if (contactForm) {
      contactForm.reset();
    }
  });
}

renderContactoPublico();
loadLastMessage();