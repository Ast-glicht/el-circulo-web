const serviciosSitio = window.ElCirculoData.getServicios();

const servicesAgenda = {};

serviciosSitio.forEach((servicio) => {
  servicesAgenda[servicio.id] = {
    nombre: servicio.title,
    tipo: servicio.tipoAgenda,
    precioHoraPersona: servicio.precioHoraPersona,
    precioDiagnostico: servicio.precioDiagnostico,
    precioLiberacion: servicio.precioLiberacion,
    nota: servicio.details.descripcion,
    juegos: servicio.details.juegos || [],
  };
});

const params = new URLSearchParams(window.location.search);
const serviceKey = params.get("servicio") || "playstation";

function resolverServicioAgenda(key) {
  if (servicesAgenda[key]) return servicesAgenda[key];

  const servicioPlayStation = serviciosSitio.find((servicio) => {
    const texto = `${servicio.id} ${servicio.title}`.toLowerCase();
    return texto.includes("ps4") || texto.includes("ps5") || texto.includes("playstation");
  });

  if (servicioPlayStation) {
    return servicesAgenda[servicioPlayStation.id];
  }

  return Object.values(servicesAgenda)[0];
}

const selectedService = resolverServicioAgenda(serviceKey);
const agendaTitle = document.getElementById("agendaTitle");
const agendaSubtitle = document.getElementById("agendaSubtitle");
const dynamicFields = document.getElementById("dynamicFields");
const agendaForm = document.getElementById("agendaForm");
const summaryText = document.getElementById("summaryText");
const agendaStatus = document.getElementById("agendaStatus");

agendaTitle.textContent = selectedService.nombre;

agendaSubtitle.textContent =
  selectedService.tipo === "gaming"
    ? "Agenda tu estación gamer indicando personas, horas, controles, fecha, hora y juego."
    : "Agenda tu servicio técnico indicando los datos de la consola y la información necesaria.";

function renderGamingFields() {
  dynamicFields.innerHTML = `
    <h3>Datos de la reserva gamer</h3>

    <div class="agenda-price-card">
      <span>Precio por persona / hora</span>
      <strong>C$ ${selectedService.precioHoraPersona}</strong>
    </div>

    <div class="agenda-grid">
      <label>
        Cantidad de personas
        <input type="number" id="people" name="people" min="1" value="1" required>
      </label>

      <label>
        Cantidad de horas
        <input type="number" id="hours" name="hours" min="1" value="1" required>
      </label>

      <label>
        Controles a ocupar
        <input type="number" id="controllers" name="controllers" min="1" value="1" required>
      </label>

      <label>
        Día de llegada
        <input type="date" id="arrivalDate" name="arrivalDate" required>
      </label>

      <label>
        Hora de llegada
        <input type="time" id="arrivalTime" name="arrivalTime" required>
      </label>

      <label class="agenda-full">
        Juego a jugar
        <select id="game" name="game" required>
          <option value="">Selecciona un juego</option>
          ${selectedService.juegos
            .map((game) => `<option value="${game}">${game}</option>`)
            .join("")}
        </select>
      </label>
    </div>
  `;

  const people = document.getElementById("people");
  const hours = document.getElementById("hours");
  const controllers = document.getElementById("controllers");
  const arrivalDate = document.getElementById("arrivalDate");
  const arrivalTime = document.getElementById("arrivalTime");
  const game = document.getElementById("game");

  [people, hours, controllers, arrivalDate, arrivalTime, game].forEach((field) => {
    field.addEventListener("input", updateGamingSummary);
    field.addEventListener("change", updateGamingSummary);
  });

  updateGamingSummary();
}

function updateGamingSummary() {
  const people = Number(document.getElementById("people")?.value || 1);
  const hours = Number(document.getElementById("hours")?.value || 1);
  const controllers = Number(document.getElementById("controllers")?.value || 1);
  const arrivalDate = document.getElementById("arrivalDate")?.value || "sin fecha";
  const arrivalTime = document.getElementById("arrivalTime")?.value || "sin hora";
  const game = document.getElementById("game")?.value || "sin juego seleccionado";

  const total = people * hours * selectedService.precioHoraPersona;

  summaryText.innerHTML = `
    Servicio: <strong>${selectedService.nombre}</strong><br>
    Personas: <strong>${people}</strong><br>
    Horas: <strong>${hours}</strong><br>
    Controles: <strong>${controllers}</strong><br>
    Día: <strong>${arrivalDate}</strong><br>
    Hora: <strong>${arrivalTime}</strong><br>
    Juego: <strong>${game}</strong><br>
    Total estimado: <strong>C$ ${total}</strong>
  `;
}

function renderLiberacionFields() {
  dynamicFields.innerHTML = `
    <h3>Datos para liberación</h3>

    <div class="technical-layout">
      <aside class="agenda-price-card technical-price">
        <span>Costo de liberación</span>
        <strong>C$ ${selectedService.precioLiberacion}</strong>
        <small>${selectedService.nota}</small>
      </aside>

      <div class="agenda-grid">
        <label>
          Tipo de consola
          <input type="text" id="consoleType" name="consoleType" placeholder="Ej: PS4, PS5, Nintendo Switch" required>
        </label>

        <label>
          Día de entrega o revisión
          <input type="date" id="arrivalDate" name="arrivalDate" required>
        </label>

        <label>
          Hora de revisión
          <input type="time" id="arrivalTime" name="arrivalTime" required>
        </label>

        <label class="agenda-full">
          Observaciones
          <textarea id="notes" name="notes" rows="4" placeholder="Ej: modelo, versión, estado de la consola o detalles importantes"></textarea>
        </label>
      </div>
    </div>
  `;

  const consoleType = document.getElementById("consoleType");
  const arrivalDate = document.getElementById("arrivalDate");
  const arrivalTime = document.getElementById("arrivalTime");
  const notes = document.getElementById("notes");

  [consoleType, arrivalDate, arrivalTime, notes].forEach((field) => {
    field.addEventListener("input", updateLiberacionSummary);
    field.addEventListener("change", updateLiberacionSummary);
  });

  updateLiberacionSummary();
}

function updateLiberacionSummary() {
  const consoleType = document.getElementById("consoleType")?.value || "sin consola indicada";
  const arrivalDate = document.getElementById("arrivalDate")?.value || "sin fecha";
  const arrivalTime = document.getElementById("arrivalTime")?.value || "sin hora";
  const notes = document.getElementById("notes")?.value || "sin observaciones";

  summaryText.innerHTML = `
    Servicio: <strong>${selectedService.nombre}</strong><br>
    Consola: <strong>${consoleType}</strong><br>
    Día de revisión: <strong>${arrivalDate}</strong><br>
    Hora de revisión: <strong>${arrivalTime}</strong><br>
    Costo estimado: <strong>C$ ${selectedService.precioLiberacion}</strong><br>
    Observaciones: <strong>${notes}</strong>
  `;
}

function renderMantenimientoFields() {
  dynamicFields.innerHTML = `
    <h3>Datos para mantenimiento</h3>

    <div class="technical-layout">
      <aside class="agenda-price-card technical-price">
        <span>Precio de diagnóstico</span>
        <strong>C$ ${selectedService.precioDiagnostico}</strong>
        <small>${selectedService.nota}</small>
      </aside>

      <div class="agenda-grid">
        <label>
          Tipo de consola
          <input type="text" id="consoleType" name="consoleType" placeholder="Ej: PS4, PS5, Nintendo Switch" required>
        </label>

        <label>
          Día de entrega o revisión
          <input type="date" id="arrivalDate" name="arrivalDate" required>
        </label>

        <label>
          Hora de revisión
          <input type="time" id="arrivalTime" name="arrivalTime" required>
        </label>

        <label class="agenda-full">
          Descripción del problema
          <textarea id="problemDescription" name="problemDescription" rows="5" placeholder="Ej: se calienta, se apaga, hace ruido, no lee juegos, etc." required></textarea>
        </label>
      </div>
    </div>
  `;

  const consoleType = document.getElementById("consoleType");
  const arrivalDate = document.getElementById("arrivalDate");
  const arrivalTime = document.getElementById("arrivalTime");
  const problemDescription = document.getElementById("problemDescription");

  [consoleType, arrivalDate, arrivalTime, problemDescription].forEach((field) => {
    field.addEventListener("input", updateMantenimientoSummary);
    field.addEventListener("change", updateMantenimientoSummary);
  });

  updateMantenimientoSummary();
}

function updateMantenimientoSummary() {
  const consoleType = document.getElementById("consoleType")?.value || "sin consola indicada";
  const arrivalDate = document.getElementById("arrivalDate")?.value || "sin fecha";
  const arrivalTime = document.getElementById("arrivalTime")?.value || "sin hora";
  const problemDescription =
    document.getElementById("problemDescription")?.value || "sin descripción";

  summaryText.innerHTML = `
    Servicio: <strong>${selectedService.nombre}</strong><br>
    Consola: <strong>${consoleType}</strong><br>
    Día de revisión: <strong>${arrivalDate}</strong><br>
    Hora de revisión: <strong>${arrivalTime}</strong><br>
    Diagnóstico: <strong>C$ ${selectedService.precioDiagnostico}</strong><br>
    Nota: <strong>El precio final puede variar conforme al diagnóstico.</strong><br>
    Problema indicado: <strong>${problemDescription}</strong>
  `;
}

if (selectedService.tipo === "gaming") {
  renderGamingFields();
}

if (selectedService.tipo === "liberacion") {
  renderLiberacionFields();
}

if (selectedService.tipo === "mantenimiento") {
  renderMantenimientoFields();
}

agendaForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = Object.fromEntries(new FormData(agendaForm).entries());
const validacionHorario = window.ElCirculoData.estaDentroDelHorario(
  formData.arrivalDate,
  formData.arrivalTime
);

if (!validacionHorario.valido) {
  agendaStatus.textContent = validacionHorario.mensaje;
  return;
}
  const agendaData = {
    servicio: selectedService.nombre,
    tipo: selectedService.tipo,
    cliente: {
      nombre: formData.clientName,
      telefono: formData.clientPhone,
      gmail: formData.clientEmail,
    },
    datosServicio: formData,
    fechaRegistro: new Date().toLocaleString(),
  };

  localStorage.setItem("ultima-agenda-el-circulo", JSON.stringify(agendaData));

  let mensaje = `Hola, quiero agendar un servicio en El Círculo Gaming House.\n\n`;
  mensaje += `Servicio: ${selectedService.nombre}\n`;
  mensaje += `Nombre: ${formData.clientName}\n`;
  mensaje += `Teléfono: ${formData.clientPhone}\n`;
  mensaje += `Gmail: ${formData.clientEmail}\n`;

  if (selectedService.tipo === "gaming") {
    const total =
      Number(formData.people) *
      Number(formData.hours) *
      selectedService.precioHoraPersona;

    mensaje += `\nDatos de la reserva gamer:\n`;
    mensaje += `Personas: ${formData.people}\n`;
    mensaje += `Horas: ${formData.hours}\n`;
    mensaje += `Controles: ${formData.controllers}\n`;
    mensaje += `Día: ${formData.arrivalDate}\n`;
    mensaje += `Hora: ${formData.arrivalTime}\n`;
    mensaje += `Juego: ${formData.game}\n`;
    mensaje += `Total estimado: C$ ${total}\n`;
  }

  if (selectedService.tipo === "liberacion") {
    mensaje += `\nDatos de liberación:\n`;
    mensaje += `Consola: ${formData.consoleType}\n`;
    mensaje += `Día de revisión: ${formData.arrivalDate}\n`;
    mensaje += `Hora de revisión: ${formData.arrivalTime}\n`;
    mensaje += `Costo estimado: C$ ${selectedService.precioLiberacion}\n`;
    mensaje += `Observaciones: ${formData.notes || "Sin observaciones"}\n`;
  }

  if (selectedService.tipo === "mantenimiento") {
    mensaje += `\nDatos de mantenimiento:\n`;
    mensaje += `Consola: ${formData.consoleType}\n`;
    mensaje += `Día de revisión: ${formData.arrivalDate}\n`;
    mensaje += `Hora de revisión: ${formData.arrivalTime}\n`;
    mensaje += `Diagnóstico: C$ ${selectedService.precioDiagnostico}\n`;
    mensaje += `Problema: ${formData.problemDescription}\n`;
    mensaje += `Nota: El precio final puede variar según el diagnóstico.\n`;
  }

  mensaje += `\nAgenda enviada desde la página web.`;

  const numeroWhatsApp = "50581899736";
  const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

  agendaStatus.textContent = "Redirigiendo a WhatsApp para enviar la agenda...";

  window.open(urlWhatsApp, "_blank");

  agendaForm.reset();

  if (selectedService.tipo === "gaming") updateGamingSummary();
  if (selectedService.tipo === "liberacion") updateLiberacionSummary();
  if (selectedService.tipo === "mantenimiento") updateMantenimientoSummary();
});