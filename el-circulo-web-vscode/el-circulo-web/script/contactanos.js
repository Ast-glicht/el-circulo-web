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
const contactCards = document.querySelector(".combined-contact-cards");

const CORREO_NEGOCIO = "osoriocorteza@gmail.com";

function setMode(mode) {
  formStatus.textContent = "";
  communicationType.value = mode;

  contactOption.classList.toggle("active", mode === "contacto");
  suggestionOption.classList.toggle("active", mode === "sugerencia");

  if (mode === "contacto") {
    pageTitle.textContent = "Contacto";
    pageDescription.textContent =
      "Puedes escribirnos o visitarnos. Aquí encontrarás nuestras redes, teléfono, dirección y ubicación.";

    infoTitle.textContent = "Información de contacto";
    formTitle.textContent = "Enviar mensaje";
    submitBtn.textContent = "Enviar mensaje";
    messageLabel.textContent = "Mensaje";
    message.placeholder = "Escribe tu mensaje";

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
    pageTitle.textContent = "Sugerencias";
    pageDescription.textContent =
      "Ayúdanos a mejorar la experiencia gamer. Puedes sugerir juegos, eventos, torneos, servicios o cambios para el local.";

    infoTitle.textContent = "¿Qué puedes sugerir?";
    formTitle.textContent = "Enviar sugerencia";
    submitBtn.textContent = "Enviar sugerencia";
    messageLabel.textContent = "Sugerencia";
    message.placeholder = "Escribe tu sugerencia...";

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
    `&to=${encodeURIComponent(CORREO_NEGOCIO)}` +
    `&su=${encodeURIComponent(asunto)}` +
    `&body=${encodeURIComponent(cuerpo)}`;

  window.open(gmailUrl, "_blank");
}

contactOption.addEventListener("click", () => setMode("contacto"));
suggestionOption.addEventListener("click", () => setMode("sugerencia"));

communicationForm.addEventListener("submit", function (e) {
  e.preventDefault();

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

    formStatus.classList.remove("error");
    formStatus.textContent = "Abriendo Gmail para enviar el mensaje al correo del negocio...";

    abrirGmailConMensaje(data);

    setTimeout(() => {
      communicationForm.reset();
      formStatus.textContent = "Mensaje preparado en Gmail. Solo debes presionar Enviar.";
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

    formStatus.classList.remove("error");
    formStatus.textContent = "¡Gracias! Tu sugerencia fue guardada correctamente.";

    communicationForm.reset();
    communicationType.value = "sugerencia";
  }
});

setMode("contacto");