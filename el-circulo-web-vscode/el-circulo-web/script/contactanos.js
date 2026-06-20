const CONTACTO_DEFAULT = {
  facebookTexto: "El Círculo Gaming House",
  facebookUrl: "https://www.facebook.com/p/El-Circulo-Gaming-House-100063761764940/",
  instagramTexto: "@elcirculogaminghouse",
  instagramUrl: "https://www.instagram.com/elcirculogaminghouse/",
  tiktokTexto: "@elcirculogaminghouse",
  tiktokUrl: "https://www.tiktok.com/@elcirculogaminghouse",
  telefonoTexto: "8942 8230",
  telefonoUrl: "+50589428230",
  correoNegocio: "osoriocorteza@gmail.com",
  direccion: "Edificios de la UNI, Av. Universitaria Casimiro Sotelo, Managua 11125",
  mapaUrl: "https://www.google.com/maps?q=Edificios%20de%20la%20UNI,%20Av.%20Universitaria%20Casimiro%20Sotelo,%20Managua%2011125&z=16&output=embed",

  contactoPageTitle: "Contacto",
  contactoPageDescription: "Puedes escribirnos o visitarnos. Aquí encontrarás nuestras redes, teléfono, dirección y ubicación.",
  contactoInfoTitle: "Información de contacto",
  contactoFormTitle: "Enviar mensaje",
  contactoSubmitText: "Enviar mensaje",
  contactoMessageLabel: "Mensaje",
  contactoMessagePlaceholder: "Escribe tu mensaje",

  sugerenciaPageTitle: "Sugerencias",
  sugerenciaPageDescription: "Ayúdanos a mejorar la experiencia gamer. Puedes sugerir juegos, eventos, torneos, servicios o cambios para el local.",
  sugerenciaInfoTitle: "¿Qué puedes sugerir?",
  sugerenciaFormTitle: "Enviar sugerencia",
  sugerenciaSubmitText: "Enviar sugerencia",
  sugerenciaMessageLabel: "Sugerencia",
  sugerenciaMessagePlaceholder: "Escribe tu sugerencia...",

  categoriasSugerencia: ["Juegos", "Eventos", "Servicios", "Atención", "Otro"],
  sugerenciaIdeas: [
    "Nuevos juegos para PS4, PS5 o Nintendo Switch.",
    "Ideas para torneos, promociones o eventos especiales.",
    "Mejoras en horarios, atención, comodidad o servicios."
  ]
};

let contactoConfig = { ...CONTACTO_DEFAULT };

document.addEventListener("DOMContentLoaded", async () => {
  if (window.ElCirculoDataReady) {
    await window.ElCirculoDataReady;
  }

  cargarConfiguracionContacto();
  renderizarInformacionContacto();
  renderizarCategoriasSugerencia();
  renderizarIdeasSugerencia();
  configurarSwitch();
  configurarFormulario();
  actualizarFooterSocials();
  setMode("contacto");
});

function escapeHTML(texto = "") {
  return String(texto)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function cargarConfiguracionContacto() {
  const contactoGuardado =
    window.ElCirculoData && window.ElCirculoData.getContacto
      ? window.ElCirculoData.getContacto()
      : {};

  contactoConfig = {
    ...CONTACTO_DEFAULT,
    ...(contactoGuardado || {}),
    categoriasSugerencia: Array.isArray(contactoGuardado?.categoriasSugerencia)
      ? contactoGuardado.categoriasSugerencia
      : CONTACTO_DEFAULT.categoriasSugerencia,
    sugerenciaIdeas: Array.isArray(contactoGuardado?.sugerenciaIdeas)
      ? contactoGuardado.sugerenciaIdeas
      : CONTACTO_DEFAULT.sugerenciaIdeas
  };
}

function renderizarInformacionContacto() {
  const contactCards = document.getElementById("combinedContactCards");
  const mapPanel = document.getElementById("mapPanel");

  if (contactCards) {
    contactCards.innerHTML = `
      <article class="contact-card">
        <h3>Facebook</h3>
        <p>
          <a href="${contactoConfig.facebookUrl}" target="_blank">
            ${escapeHTML(contactoConfig.facebookTexto)}
          </a>
        </p>
      </article>

      <article class="contact-card">
        <h3>Instagram</h3>
        <p>
          <a href="${contactoConfig.instagramUrl}" target="_blank">
            ${escapeHTML(contactoConfig.instagramTexto)}
          </a>
        </p>
      </article>

      <article class="contact-card">
        <h3>TikTok</h3>
        <p>
          <a href="${contactoConfig.tiktokUrl}" target="_blank">
            ${escapeHTML(contactoConfig.tiktokTexto)}
          </a>
        </p>
      </article>

      <article class="contact-card">
        <h3>Teléfono</h3>
        <p>
          <a href="tel:${contactoConfig.telefonoUrl}">
            ${escapeHTML(contactoConfig.telefonoTexto)}
          </a>
        </p>
      </article>

      <article class="contact-card">
        <h3>Correo</h3>
        <p>
          <a href="mailto:${contactoConfig.correoNegocio}">
            ${escapeHTML(contactoConfig.correoNegocio)}
          </a>
        </p>
      </article>

      <article class="contact-card">
        <h3>Dirección</h3>
        <p>${escapeHTML(contactoConfig.direccion)}</p>
      </article>
    `;
  }

  if (mapPanel) {
    mapPanel.innerHTML = `
      <h3>Ubicación</h3>
      <iframe
        src="${contactoConfig.mapaUrl}"
        width="100%"
        height="260"
        style="border:0;"
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade">
      </iframe>
    `;
  }
}

function renderizarCategoriasSugerencia() {
  const category = document.getElementById("category");
  if (!category) return;

  category.innerHTML = `
    <option value="">Selecciona una opción</option>
    ${contactoConfig.categoriasSugerencia
      .map((categoria) => `
        <option value="${escapeHTML(categoria)}">${escapeHTML(categoria)}</option>
      `)
      .join("")}
  `;
}

function renderizarIdeasSugerencia() {
  const suggestionIdeas = document.getElementById("suggestionIdeas");
  if (!suggestionIdeas) return;

  suggestionIdeas.innerHTML = contactoConfig.sugerenciaIdeas
    .map((idea, index) => `
      <div>
        <span>${String(index + 1).padStart(2, "0")}</span>
        <p>${escapeHTML(idea)}</p>
      </div>
    `)
    .join("");
}

function actualizarFooterSocials() {
  const facebook = document.querySelector('.footer-socials a[aria-label="Facebook"]');
  const instagram = document.querySelector('.footer-socials a[aria-label="Instagram"]');
  const tiktok = document.querySelector('.footer-socials a[aria-label="TikTok"]');

  if (facebook) facebook.href = contactoConfig.facebookUrl;
  if (instagram) instagram.href = contactoConfig.instagramUrl;
  if (tiktok) tiktok.href = contactoConfig.tiktokUrl;
}

function setMode(mode) {
  const communicationForm = document.getElementById("communicationForm");
  const formStatus = document.getElementById("formStatus");

  const contactOption = document.getElementById("contactOption");
  const suggestionOption = document.getElementById("suggestionOption");

  const pageTitle = document.getElementById("pageTitle");
  const pageDescription = document.getElementById("pageDescription");
  const infoTitle = document.getElementById("infoTitle");
  const formTitle = document.getElementById("formTitle");
  const submitBtn = document.getElementById("submitBtn");
  const messageLabel = document.getElementById("messageLabel");
  const communicationType = document.getElementById("communicationType");

  const emailGroup = document.getElementById("emailGroup");
  const phoneGroup = document.getElementById("phoneGroup");
  const categoryGroup = document.getElementById("categoryGroup");

  const email = document.getElementById("email");
  const category = document.getElementById("category");
  const message = document.getElementById("message");

  const mapPanel = document.getElementById("mapPanel");
  const suggestionIdeas = document.getElementById("suggestionIdeas");
  const contactCards = document.getElementById("combinedContactCards");

  if (!communicationForm) return;

  if (formStatus) {
    formStatus.textContent = "";
    formStatus.classList.remove("error");
  }

  communicationType.value = mode;

  contactOption.classList.toggle("active", mode === "contacto");
  suggestionOption.classList.toggle("active", mode === "sugerencia");

  if (mode === "contacto") {
    pageTitle.textContent = contactoConfig.contactoPageTitle;
    pageDescription.textContent = contactoConfig.contactoPageDescription;
    infoTitle.textContent = contactoConfig.contactoInfoTitle;
    formTitle.textContent = contactoConfig.contactoFormTitle;
    submitBtn.textContent = contactoConfig.contactoSubmitText;
    messageLabel.textContent = contactoConfig.contactoMessageLabel;
    message.placeholder = contactoConfig.contactoMessagePlaceholder;

    emailGroup.classList.remove("hidden");
    phoneGroup.classList.remove("hidden");
    categoryGroup.classList.add("hidden");

    contactCards.classList.remove("hidden");
    mapPanel.classList.remove("hidden");
    suggestionIdeas.classList.add("hidden");

    email.required = true;
    category.required = false;
  }

  if (mode === "sugerencia") {
    pageTitle.textContent = contactoConfig.sugerenciaPageTitle;
    pageDescription.textContent = contactoConfig.sugerenciaPageDescription;
    infoTitle.textContent = contactoConfig.sugerenciaInfoTitle;
    formTitle.textContent = contactoConfig.sugerenciaFormTitle;
    submitBtn.textContent = contactoConfig.sugerenciaSubmitText;
    messageLabel.textContent = contactoConfig.sugerenciaMessageLabel;
    message.placeholder = contactoConfig.sugerenciaMessagePlaceholder;

    emailGroup.classList.add("hidden");
    phoneGroup.classList.add("hidden");
    categoryGroup.classList.remove("hidden");

    contactCards.classList.add("hidden");
    mapPanel.classList.add("hidden");
    suggestionIdeas.classList.remove("hidden");

    email.required = false;
    category.required = true;
  }

  communicationForm.reset();
  communicationType.value = mode;
}

function configurarSwitch() {
  const contactOption = document.getElementById("contactOption");
  const suggestionOption = document.getElementById("suggestionOption");

  if (contactOption) {
    contactOption.addEventListener("click", () => setMode("contacto"));
  }

  if (suggestionOption) {
    suggestionOption.addEventListener("click", () => setMode("sugerencia"));
  }
}

function saveContact(data) {
  localStorage.setItem("elcirculo-contacto", JSON.stringify(data));
}

function saveSuggestion(data) {
  const sugerenciasGuardadas =
    JSON.parse(localStorage.getItem("elcirculo-sugerencias")) || [];

  sugerenciasGuardadas.push(data);

  localStorage.setItem(
    "elcirculo-sugerencias",
    JSON.stringify(sugerenciasGuardadas)
  );
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
    `&to=${encodeURIComponent(contactoConfig.correoNegocio)}` +
    `&su=${encodeURIComponent(asunto)}` +
    `&body=${encodeURIComponent(cuerpo)}`;

  window.open(gmailUrl, "_blank");
}

function configurarFormulario() {
  const communicationForm = document.getElementById("communicationForm");
  const formStatus = document.getElementById("formStatus");
  const communicationType = document.getElementById("communicationType");

  if (!communicationForm || !formStatus || !communicationType) return;

  communicationForm.addEventListener("submit", function (e) {
    e.preventDefault();

    formStatus.classList.remove("error");

    const mode = communicationType.value;
    const data = Object.fromEntries(new FormData(communicationForm).entries());

    data.name = String(data.name || "").trim();
    data.email = String(data.email || "").trim();
    data.phone = String(data.phone || "").trim();
    data.category = String(data.category || "").trim();
    data.message = String(data.message || "").trim();
    data.fecha = new Date().toLocaleString();

    if (data.name.length < 3) {
      formStatus.textContent = "Escribe un nombre válido.";
      formStatus.classList.add("error");
      return;
    }

    if (mode === "contacto") {
      if (!data.email.includes("@") || !data.email.includes(".")) {
        formStatus.textContent = "Escribe un correo electrónico válido.";
        formStatus.classList.add("error");
        return;
      }

      if (data.message.length < 10) {
        formStatus.textContent = "El mensaje debe tener al menos 10 caracteres.";
        formStatus.classList.add("error");
        return;
      }

      saveContact(data);

      formStatus.textContent =
        "Abriendo Gmail para enviar el mensaje al correo del negocio...";

      abrirGmailConMensaje(data);

      setTimeout(() => {
        communicationForm.reset();
        communicationType.value = "contacto";
        formStatus.textContent =
          "Mensaje preparado en Gmail. Solo debes presionar Enviar.";
      }, 800);
    }

    if (mode === "sugerencia") {
      if (!data.category) {
        formStatus.textContent = "Selecciona una categoría.";
        formStatus.classList.add("error");
        return;
      }

      if (data.message.length < 10) {
        formStatus.textContent = "La sugerencia debe tener al menos 10 caracteres.";
        formStatus.classList.add("error");
        return;
      }

      saveSuggestion({
        nombre: data.name,
        categoria: data.category,
        mensaje: data.message,
        fecha: data.fecha
      });

      formStatus.textContent =
        "¡Gracias! Tu sugerencia fue guardada correctamente.";

      communicationForm.reset();
      communicationType.value = "sugerencia";
    }
  });
}