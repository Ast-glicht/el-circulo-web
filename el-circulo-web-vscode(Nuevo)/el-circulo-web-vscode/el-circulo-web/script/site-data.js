const EL_CIRCULO_DATA_KEY = "elcirculo-site-data-v1";

const defaultSiteData = {
  horarios: {
    domingo: { abierto: true, inicio: "17:30", fin: "22:00", texto: "5:30 p.m.–10:00 p.m." },
    lunes: { abierto: true, inicio: "08:00", fin: "20:00", texto: "8:00 a.m.–8:00 p.m." },
    martes: { abierto: true, inicio: "08:00", fin: "20:00", texto: "8:00 a.m.–8:00 p.m." },
    miercoles: { abierto: true, inicio: "08:00", fin: "20:00", texto: "8:00 a.m.–8:00 p.m." },
    jueves: { abierto: true, inicio: "08:00", fin: "20:00", texto: "8:00 a.m.–8:00 p.m." },
    viernes: { abierto: true, inicio: "08:00", fin: "20:00", texto: "8:00 a.m.–8:00 p.m." },
    sabado: { abierto: true, inicio: "08:00", fin: "20:00", texto: "8:00 a.m.–8:00 p.m." },
  },

  eventos: [
    {
      id: 1,
      titulo: "Torneo FIFA",
      fecha: "2026-05-15",
      hora: "18:00",
      estado: "Activo",
      descripcion: "Competencia amistosa para jugadores de PS4 y PS5.",
      imagen: "",
      video: "",
    },
    {
      id: 2,
      titulo: "Noche Nintendo",
      fecha: "2026-05-21",
      hora: "18:00",
      estado: "Próximamente",
      descripcion: "Sesión multijugador con juegos familiares y competitivos.",
      imagen: "",
      video: "",
    },
    {
      id: 3,
      titulo: "Reto Gamer",
      fecha: "2026-05-28",
      hora: "18:00",
      estado: "Próximamente",
      descripcion: "Dinámicas rápidas, premios simbólicos y partidas especiales.",
      imagen: "",
      video: "",
    },
  ],

  servicios: [
    {
      id: "ps4",
      title: "Servicio de Gaming PS4",
      type: "cyan",
      tag: "Gaming",
      short: "Disfruta estaciones PS4 listas para jugar.",
      tipoAgenda: "gaming",
      precioHoraPersona: 40,
      imagen: "",
      details: {
        descripcion: "Servicio de entretenimiento en consola PlayStation 4, ideal para jugar de forma individual o con amigos en un ambiente cómodo y gamer.",
        precio: "C$ 40 por hora",
        tituloJuegos: "Juegos disponibles",
        reglas: [
          "Cuidar los controles y equipos.",
          "No desconectar cables ni mover consolas.",
          "Respetar el tiempo asignado.",
          "No consumir alimentos directamente sobre el equipo.",
        ],
        juegos: [
          "FIFA",
          "Mortal Kombat",
          "Dragon Ball FighterZ",
          "Call of Duty",
          "Minecraft",
          "Grand Theft Auto V",
        ],
        equipos: [
          "2 consolas PS4 disponibles",
          "4 controles disponibles",
          "Pantallas listas para juego",
          "Audífonos sujetos a disponibilidad",
        ],
      },
    },
    {
      id: "ps5",
      title: "Servicio de Gaming PS5",
      type: "green",
      tag: "Nueva generación",
      short: "Vive gráficos y velocidad de última generación.",
      tipoAgenda: "gaming",
      precioHoraPersona: 60,
      imagen: "",
      details: {
        descripcion: "Servicio de gaming en PlayStation 5 para jugadores que buscan mejor rendimiento, gráficos modernos y una experiencia más fluida.",
        precio: "C$ 60 por hora",
        tituloJuegos: "Juegos disponibles",
        reglas: [
          "Usar los controles con cuidado.",
          "No modificar configuraciones de la consola.",
          "Respetar turnos y horarios.",
          "Reportar cualquier falla antes de jugar.",
        ],
        juegos: [
          "EA Sports FC",
          "Spider-Man",
          "Mortal Kombat 1",
          "Fortnite",
          "Call of Duty Warzone",
          "Tekken 8",
        ],
        equipos: [
          "1 consola PS5 disponible",
          "2 controles DualSense",
          "Pantalla de alta resolución",
          "Estación gamer individual",
        ],
      },
    },
    {
      id: "switch",
      title: "Servicio de Gaming Switch",
      type: "bluegreen",
      tag: "Nintendo",
      short: "Diversión portátil y multijugador.",
      tipoAgenda: "gaming",
      precioHoraPersona: 45,
      imagen: "",
      details: {
        descripcion: "Servicio orientado a partidas casuales, familiares y multijugador con consola Nintendo Switch.",
        precio: "C$ 45 por hora",
        tituloJuegos: "Juegos disponibles",
        reglas: [
          "Usar los Joy-Con correctamente.",
          "No retirar juegos o accesorios sin autorización.",
          "Mantener el área ordenada.",
          "Respetar las partidas de otros usuarios.",
        ],
        juegos: [
          "Mario Kart 8 Deluxe",
          "Super Smash Bros. Ultimate",
          "Mario Party",
          "Nintendo Switch Sports",
          "Minecraft",
          "Super Mario Odyssey",
        ],
        equipos: [
          "1 consola Nintendo Switch",
          "2 Joy-Con disponibles",
          "Base de carga",
          "Pantalla para modo TV",
        ],
      },
    },
    {
      id: "mantenimiento",
      title: "Mantenimiento de Consolas",
      type: "cyan",
      tag: "Soporte técnico",
      short: "Diagnóstico, limpieza y revisión general.",
      tipoAgenda: "mantenimiento",
      precioDiagnostico: 150,
      imagen: "",
      details: {
        descripcion: "Servicio técnico enfocado en revisar, limpiar y mejorar el estado general de consolas.",
        precio: "Desde C$ 150 según diagnóstico",
        tituloJuegos: "Consolas aptas para mantenimiento",
        reglas: [
          "El equipo debe entregarse completo.",
          "El diagnóstico puede variar según el estado de la consola.",
          "No se garantiza reparación si el daño es grave.",
          "El cliente debe confirmar antes de realizar trabajos adicionales.",
        ],
        juegos: [
          "PlayStation 4",
          "PlayStation 5",
          "Nintendo Switch",
          "Consolas con problemas de calentamiento",
        ],
        equipos: [
          "Kit de limpieza",
          "Herramientas técnicas",
          "Pasta térmica según disponibilidad",
          "Área de revisión técnica",
        ],
      },
    },
    {
      id: "liberacion",
      title: "Liberación de Consola",
      type: "green",
      tag: "Especializado",
      short: "Consulta disponibilidad y compatibilidad.",
      tipoAgenda: "liberacion",
      precioLiberacion: 500,
      imagen: "",
      details: {
        descripcion: "Servicio especializado que depende del modelo, versión y compatibilidad de la consola.",
        precio: "Desde C$ 500 según modelo",
        tituloJuegos: "Equipos aptos para liberación",
        reglas: [
          "Debe evaluarse el modelo de la consola.",
          "No todas las consolas son compatibles.",
          "El cliente debe aceptar los riesgos del procedimiento.",
          "El servicio se realiza únicamente bajo confirmación previa.",
        ],
        juegos: [
          "Consolas compatibles según modelo",
          "Consolas con versión apta para revisión",
          "Equipos que permitan evaluación previa",
        ],
        equipos: [
          "Herramientas de diagnóstico",
          "Software de revisión",
          "Consola del cliente",
          "Equipo técnico especializado",
        ],
      },
    },
  ],

  contacto: {
    facebookTexto: "El Círculo Gaming House",
    facebookUrl: "https://www.facebook.com/p/El-Circulo-Gaming-House-100063761764940/",
    instagramTexto: "@elcirculogaminghouse",
    instagramUrl: "https://www.instagram.com/elcirculogaminghouse/",
    telefonoTexto: "8942 8230",
    telefonoUrl: "+50589428230",
    direccion: "Edificios de la UNI, Av. Universitaria Casimiro Sotelo, Managua 11125",
    mapaUrl: "https://www.google.com/maps?q=Edificios%20de%20la%20UNI,%20Av.%20Universitaria%20Casimiro%20Sotelo,%20Managua%2011125&z=16&output=embed",
  },
};

function getSiteData() {
  const saved = localStorage.getItem(EL_CIRCULO_DATA_KEY);

  if (!saved) {
    localStorage.setItem(EL_CIRCULO_DATA_KEY, JSON.stringify(defaultSiteData));
    return structuredClone(defaultSiteData);
  }

  try {
    const parsed = JSON.parse(saved);
    return {
      ...structuredClone(defaultSiteData),
      ...parsed,
    };
  } catch {
    localStorage.setItem(EL_CIRCULO_DATA_KEY, JSON.stringify(defaultSiteData));
    return structuredClone(defaultSiteData);
  }
}

function saveSiteData(data) {
  localStorage.setItem(EL_CIRCULO_DATA_KEY, JSON.stringify(data));
}

function getServicios() {
  return getSiteData().servicios;
}

function getServicioById(id) {
  return getServicios().find((servicio) => servicio.id === id);
}

function getHorarios() {
  return getSiteData().horarios;
}

function getEventos() {
  return getSiteData().eventos;
}

function getContacto() {
  return getSiteData().contacto;
}

function guardarServicios(servicios) {
  const data = getSiteData();
  data.servicios = servicios;
  saveSiteData(data);
}

function guardarHorarios(horarios) {
  const data = getSiteData();
  data.horarios = horarios;
  saveSiteData(data);
}

function guardarEventos(eventos) {
  const data = getSiteData();
  data.eventos = eventos;
  saveSiteData(data);
}

function guardarContacto(contacto) {
  const data = getSiteData();
  data.contacto = contacto;
  saveSiteData(data);
}

function obtenerDiaSemana(fechaISO) {
  const fecha = new Date(`${fechaISO}T00:00:00`);
  const dias = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
  return dias[fecha.getDay()];
}

function horaAMinutos(hora) {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

function estaDentroDelHorario(fechaISO, hora) {
  const horarios = getHorarios();
  const dia = obtenerDiaSemana(fechaISO);
  const horarioDia = horarios[dia];

  if (!horarioDia || !horarioDia.abierto) {
    return {
      valido: false,
      mensaje: "Ese día el local está cerrado.",
    };
  }

  const horaReserva = horaAMinutos(hora);
  const horaInicio = horaAMinutos(horarioDia.inicio);
  const horaFin = horaAMinutos(horarioDia.fin);

  if (horaReserva < horaInicio || horaReserva > horaFin) {
    return {
      valido: false,
      mensaje: `No puedes agendar fuera del horario de atención. Ese día atendemos de ${horarioDia.texto}.`,
    };
  }

  return {
    valido: true,
    mensaje: "Horario válido.",
  };
}

function convertirArchivoABase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject("No se pudo leer el archivo.");

    reader.readAsDataURL(file);
  });
}

window.ElCirculoData = {
  getSiteData,
  saveSiteData,
  getServicios,
  getServicioById,
  getHorarios,
  getEventos,
  getContacto,
  guardarServicios,
  guardarHorarios,
  guardarEventos,
  guardarContacto,
  estaDentroDelHorario,
  convertirArchivoABase64,
};