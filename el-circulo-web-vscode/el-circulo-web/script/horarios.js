const scheduleList = document.querySelector(".schedule-list");
const eventList = document.querySelector(".event-list");
const calendarGrid = document.querySelector(".calendar-grid");
const calendarTitle =
  document.getElementById("calendarTitle") ||
  document.querySelector(".calendar-header h3");

const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");
const goTodayBtn = document.getElementById("goToday");

const nombresDias = {
  lunes: "Lunes",
  martes: "Martes",
  miercoles: "Miércoles",
  jueves: "Jueves",
  viernes: "Viernes",
  sabado: "Sábado",
  domingo: "Domingo",
};

const nombresMeses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

let fechaCalendario = new Date();

function escapeHTML(texto = "") {
  return String(texto)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function obtenerFechaInicialCalendario() {
  const eventos = window.ElCirculoData.getEventos();

  if (!eventos || eventos.length === 0) return new Date();

  const eventosOrdenados = [...eventos]
    .filter((evento) => evento.fecha)
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  if (eventosOrdenados.length === 0) return new Date();

  return new Date(`${eventosOrdenados[0].fecha}T00:00:00`);
}

function renderHorarios() {
  if (!scheduleList) return;

  const horarios = window.ElCirculoData.getHorarios();

  scheduleList.innerHTML = Object.entries(horarios)
    .map(
      ([dia, info]) => `
        <div>
          <span>${nombresDias[dia] || dia}</span>
          <strong>${info.abierto ? escapeHTML(info.texto) : "Cerrado"}</strong>
        </div>
      `
    )
    .join("");
}

function renderEventos() {
  if (!eventList) return;

  const eventos = window.ElCirculoData.getEventos();

  if (!eventos.length) {
    eventList.innerHTML = `
      <div class="event-item">
        <div>
          <h4>No hay eventos registrados</h4>
          <p>Pronto tendremos nuevas actividades.</p>
        </div>
      </div>
    `;
    return;
  }

  const eventosOrdenados = [...eventos].sort((a, b) => {
    return (
      new Date(`${a.fecha}T${a.hora || "00:00"}`) -
      new Date(`${b.fecha}T${b.hora || "00:00"}`)
    );
  });

  eventList.innerHTML = eventosOrdenados
    .map((evento) => {
      const dia = new Date(`${evento.fecha}T00:00:00`).getDate();

      return `
        <div class="event-item" data-event-id="${evento.id}">
          <span class="event-date">${dia}</span>
          <div>
            <h4>${escapeHTML(evento.titulo)}</h4>
            <p>${escapeHTML(evento.descripcion)}</p>
            <small>
              ${escapeHTML(evento.fecha)} · ${escapeHTML(evento.hora)} · ${escapeHTML(evento.estado)}
            </small>
          </div>
        </div>
      `;
    })
    .join("");

  document.querySelectorAll(".event-item[data-event-id]").forEach((item) => {
    item.addEventListener("click", () => {
      const id = item.dataset.eventId;
      const evento = eventos.find((e) => String(e.id) === String(id));

      if (evento) abrirModalEvento(evento);
    });
  });
}

function renderCalendario() {
  if (!calendarGrid) return;

  const eventos = window.ElCirculoData.getEventos();

  const year = fechaCalendario.getFullYear();
  const month = fechaCalendario.getMonth();

  if (calendarTitle) {
    calendarTitle.textContent = `${nombresMeses[month]} ${year}`;
  }

  const primerDia = new Date(year, month, 1);
  const ultimoDia = new Date(year, month + 1, 0);
  const totalDias = ultimoDia.getDate();

  let diaSemana = primerDia.getDay();
  diaSemana = diaSemana === 0 ? 7 : diaSemana;

  const nombres = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  let html = nombres
    .map((dia) => `<div class="calendar-day-name">${dia}</div>`)
    .join("");

  for (let i = 1; i < diaSemana; i++) {
    html += `<div class="calendar-day empty"></div>`;
  }

  for (let dia = 1; dia <= totalDias; dia++) {
    const fechaActual = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      dia
    ).padStart(2, "0")}`;

    const eventosDelDia = eventos.filter((evento) => evento.fecha === fechaActual);

    if (eventosDelDia.length > 0) {
      html += `
        <div class="calendar-day event-day" data-fecha="${fechaActual}">
          ${dia}
          <small>${escapeHTML(eventosDelDia[0].titulo)}</small>
          ${
            eventosDelDia.length > 1
              ? `<small>+${eventosDelDia.length - 1} más</small>`
              : ""
          }
        </div>
      `;
    } else {
      html += `<div class="calendar-day">${dia}</div>`;
    }
  }

  calendarGrid.innerHTML = html;

  document.querySelectorAll(".event-day").forEach((day) => {
    day.addEventListener("click", () => {
      const fecha = day.dataset.fecha;
      const eventosDelDia = eventos.filter((evento) => evento.fecha === fecha);

      if (eventosDelDia.length === 1) {
        abrirModalEvento(eventosDelDia[0]);
        return;
      }

      openModal(`
        <h3>Eventos del ${escapeHTML(fecha)}</h3>

        ${eventosDelDia
          .map(
            (evento) => `
              <div class="modal-event-list-item" data-modal-event-id="${evento.id}">
                <h4>${escapeHTML(evento.titulo)}</h4>
                <p><strong>Hora:</strong> ${escapeHTML(evento.hora)}</p>
                <p>${escapeHTML(evento.descripcion)}</p>
              </div>
            `
          )
          .join("")}
      `);

      setTimeout(() => {
        document.querySelectorAll(".modal-event-list-item").forEach((item) => {
          item.addEventListener("click", () => {
            const eventoId = item.dataset.modalEventId;
            const evento = eventos.find((e) => String(e.id) === String(eventoId));

            if (evento) abrirModalEvento(evento);
          });
        });
      }, 50);
    });
  });
}

function obtenerResultadoEventoHTML(evento) {
  const estaFinalizado = evento.estado === "Finalizado";

  if (!estaFinalizado) {
    return `
      <div class="event-result-box">
        <h4>Resultado del evento</h4>
        <p>Evento en curso.</p>
      </div>
    `;
  }

  return `
    <div class="event-result-box">
      <h4>Resultado del evento</h4>

      ${
        evento.resultadoImagen
          ? `
            <div class="event-result-image-frame">
              <img 
                src="${evento.resultadoImagen}" 
                alt="Resultado de ${escapeHTML(evento.titulo)}" 
                class="event-result-img"
              >
            </div>
          `
          : ""
      }

      <p class="event-result-description">
        ${
          evento.resultadoDescripcion
            ? escapeHTML(evento.resultadoDescripcion)
            : "El evento finalizó. Aún no se ha agregado una descripción del resultado."
        }
      </p>
    </div>
  `;
}

function abrirModalEvento(evento) {
  openModal(`
    <h3>${escapeHTML(evento.titulo)}</h3>
    <p><strong>Fecha:</strong> ${escapeHTML(evento.fecha)}</p>
    <p><strong>Hora:</strong> ${escapeHTML(evento.hora)}</p>
    <p><strong>Estado:</strong> ${escapeHTML(evento.estado)}</p>
    <p>${escapeHTML(evento.descripcion)}</p>

    ${
      evento.imagen
        ? `
          <img 
            src="${evento.imagen}" 
            alt="${escapeHTML(evento.titulo)}" 
            class="modal-event-main-img"
          >
        `
        : ""
    }

    ${obtenerResultadoEventoHTML(evento)}

    ${
      evento.video
        ? `
          <p style="margin-top:15px;">
            <a href="${evento.video}" target="_blank" class="btn btn-primary">
              Ver video relacionado
            </a>
          </p>
        `
        : ""
    }
  `);
}

function configurarControlesCalendario() {
  if (prevMonthBtn) {
    prevMonthBtn.addEventListener("click", () => {
      fechaCalendario = new Date(
        fechaCalendario.getFullYear(),
        fechaCalendario.getMonth() - 1,
        1
      );

      renderCalendario();
    });
  }

  if (nextMonthBtn) {
    nextMonthBtn.addEventListener("click", () => {
      fechaCalendario = new Date(
        fechaCalendario.getFullYear(),
        fechaCalendario.getMonth() + 1,
        1
      );

      renderCalendario();
    });
  }

  if (goTodayBtn) {
    goTodayBtn.addEventListener("click", () => {
      fechaCalendario = new Date();
      renderCalendario();
    });
  }
}

function abrirEventoDesdeURL() {
  const params = new URLSearchParams(window.location.search);
  const eventoId = params.get("evento");

  if (!eventoId) return;

  const eventos = window.ElCirculoData.getEventos();
  const evento = eventos.find((item) => String(item.id) === String(eventoId));

  if (!evento) return;

  setTimeout(() => {
    abrirModalEvento(evento);
  }, 500);
}

async function iniciarHorarios() {
  if (window.ElCirculoDataReady) {
    await window.ElCirculoDataReady;
  }

  if (!window.ElCirculoData) {
    console.error("ElCirculoData no está cargado.");
    return;
  }

  fechaCalendario = obtenerFechaInicialCalendario();

  renderHorarios();
  renderEventos();
  renderCalendario();
  configurarControlesCalendario();
  abrirEventoDesdeURL();
}

iniciarHorarios();