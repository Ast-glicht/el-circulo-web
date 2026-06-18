const EL_CIRCULO_DATA_KEY = "elcirculo-site-data-v1";

const defaultSiteData = {
  promo: "",

  faq: [
    {
      id: 1,
      pregunta: "¿Necesito reservar para jugar?",
      respuesta: "No es obligatorio, pero recomendamos reservar para asegurar disponibilidad, especialmente en fines de semana, torneos o días con mayor asistencia."
    },
    {
      id: 2,
      pregunta: "¿Qué consolas tienen disponibles?",
      respuesta: "Contamos con PlayStation 4, PlayStation 5, PlayStation VR y Nintendo Switch."
    },
    {
      id: 3,
      pregunta: "¿Puedo llevar mis propios controles?",
      respuesta: "Sí, podés llevar tus propios controles siempre que sean compatibles con la consola que vas a utilizar."
    },
    {
      id: 4,
      pregunta: "¿Realizan mantenimiento de consolas?",
      respuesta: "Sí, realizamos diagnóstico, limpieza y mantenimiento preventivo para consolas compatibles."
    }
  ],

  horarios: {
    domingo: { abierto: true, inicio: "17:30", fin: "22:00", texto: "5:30 p.m.–10:00 p.m." },
    lunes: { abierto: true, inicio: "08:00", fin: "20:00", texto: "8:00 a.m.–8:00 p.m." },
    martes: { abierto: true, inicio: "08:00", fin: "20:00", texto: "8:00 a.m.–8:00 p.m." },
    miercoles: { abierto: true, inicio: "08:00", fin: "20:00", texto: "8:00 a.m.–8:00 p.m." },
    jueves: { abierto: true, inicio: "08:00", fin: "20:00", texto: "8:00 a.m.–8:00 p.m." },
    viernes: { abierto: true, inicio: "08:00", fin: "20:00", texto: "8:00 a.m.–8:00 p.m." },
    sabado: { abierto: true, inicio: "08:00", fin: "20:00", texto: "8:00 a.m.–8:00 p.m." }
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
      banner: "",
      video: ""
    },
    {
      id: 2,
      titulo: "Noche Nintendo",
      fecha: "2026-05-21",
      hora: "18:00",
      estado: "Próximamente",
      descripcion: "Sesión multijugador con juegos familiares y competitivos.",
      imagen: "",
      banner: "",
      video: ""
    },
    {
      id: 3,
      titulo: "Reto Gamer",
      fecha: "2026-05-28",
      hora: "18:00",
      estado: "Próximamente",
      descripcion: "Dinámicas rápidas, premios simbólicos y partidas especiales.",
      imagen: "",
      banner: "",
      video: ""
    }
  ],

  servicios: [
    {
      id: "playstation",
      title: "Servicio de Gaming PS4 y PS5",
      type: "cyan",
      tag: "PlayStation",
      short: "Disfruta estaciones PS4 y PS5 listas para jugar con amigos.",
      tipoAgenda: "gaming",
      precioHoraPersona: 40,
      imagen: "",
      details: {
        descripcion: "Servicio de entretenimiento en consolas PlayStation 4 y PlayStation 5, ideal para jugar de forma individual o con amigos en un ambiente cómodo, competitivo y gamer.",
        precio: "PS4: C$40 por hora / PS5: C$60 por hora",
        tituloJuegos: "Juegos disponibles",
        reglas: [
          "Cuidar los controles y equipos.",
          "No desconectar cables ni mover consolas.",
          "Respetar el tiempo asignado.",
          "No consumir alimentos directamente sobre el equipo.",
          "Reportar cualquier falla antes de jugar."
        ],
        juegos: [
          "EA Sports FC",
          "FIFA",
          "Mortal Kombat",
          "Dragon Ball FighterZ",
          "Call of Duty",
          "Minecraft",
          "Grand Theft Auto V",
          "Spider-Man",
          "Tekken 8",
          "Fortnite"
        ],
        equipos: [
          "Consolas PS4 disponibles",
          "Consola PS5 disponible",
          "Controles DualShock",
          "Controles DualSense",
          "Pantallas listas para juego",
          "Audífonos sujetos a disponibilidad"
        ]
      }
    },
    {
      id: "psvr",
      title: "Servicio PlayStation VR",
      type: "green",
      tag: "Realidad virtual",
      short: "Vive experiencias inmersivas con PlayStation VR.",
      tipoAgenda: "gaming",
      precioHoraPersona: 70,
      imagen: "",
      details: {
        descripcion: "Servicio de entretenimiento con PlayStation VR, diseñado para ofrecer una experiencia inmersiva mediante juegos y simulaciones de realidad virtual.",
        precio: "C$70 por hora o según disponibilidad del equipo",
        tituloJuegos: "Experiencias disponibles",
        reglas: [
          "Usar el visor con cuidado.",
          "No correr ni moverse bruscamente durante la experiencia.",
          "Seguir las indicaciones del personal antes de iniciar.",
          "El servicio depende de la disponibilidad del equipo.",
          "Reportar cualquier incomodidad durante el uso del visor."
        ],
        juegos: [
          "Juegos de realidad virtual",
          "Experiencias inmersivas",
          "Simuladores compatibles",
          "Títulos PS VR según disponibilidad"
        ],
        equipos: [
          "Visor PlayStation VR",
          "Consola PlayStation compatible",
          "Controles compatibles",
          "Pantalla de apoyo",
          "Accesorios VR según disponibilidad"
        ]
      }
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
        precio: "C$45 por hora",
        tituloJuegos: "Juegos disponibles",
        reglas: [
          "Usar los Joy-Con correctamente.",
          "No retirar juegos o accesorios sin autorización.",
          "Mantener el área ordenada.",
          "Respetar las partidas de otros usuarios."
        ],
        juegos: [
          "Mario Kart 8 Deluxe",
          "Super Smash Bros. Ultimate",
          "Mario Party",
          "Nintendo Switch Sports",
          "Minecraft",
          "Super Mario Odyssey"
        ],
        equipos: [
          "1 consola Nintendo Switch",
          "2 Joy-Con disponibles",
          "Base de carga",
          "Pantalla para modo TV"
        ]
      }
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
        precio: "Desde C$150 según diagnóstico",
        tituloJuegos: "Consolas aptas para mantenimiento",
        reglas: [
          "El equipo debe entregarse completo.",
          "El diagnóstico puede variar según el estado de la consola.",
          "No se garantiza reparación si el daño es grave.",
          "El cliente debe confirmar antes de realizar trabajos adicionales."
        ],
        juegos: [
          "PlayStation 4",
          "PlayStation 5",
          "Nintendo Switch",
          "Consolas con problemas de calentamiento"
        ],
        equipos: [
          "Kit de limpieza",
          "Herramientas técnicas",
          "Pasta térmica según disponibilidad",
          "Área de revisión técnica"
        ]
      }
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
        precio: "Desde C$500 según modelo",
        tituloJuegos: "Equipos aptos para liberación",
        reglas: [
          "Debe evaluarse el modelo de la consola.",
          "No todas las consolas son compatibles.",
          "El cliente debe aceptar los riesgos del procedimiento.",
          "El servicio se realiza únicamente bajo confirmación previa."
        ],
        juegos: [
          "Consolas compatibles según modelo",
          "Consolas con versión apta para revisión",
          "Equipos que permitan evaluación previa"
        ],
        equipos: [
          "Herramientas de diagnóstico",
          "Software de revisión",
          "Consola del cliente",
          "Equipo técnico especializado"
        ]
      }
    }
  ],

  contacto: {
    facebookTexto: "El Círculo Gaming House",
    facebookUrl: "https://www.facebook.com/p/El-Circulo-Gaming-House-100063761764940/",
    instagramTexto: "@elcirculogaminghouse",
    instagramUrl: "https://www.instagram.com/elcirculogaminghouse/",
    telefonoTexto: "8942 8230",
    telefonoUrl: "+50589428230",
    direccion: "Edificios de la UNI, Av. Universitaria Casimiro Sotelo, Managua 11125",
    mapaUrl: "https://www.google.com/maps?q=Edificios%20de%20la%20UNI,%20Av.%20Universitaria%20Casimiro%20Sotelo,%20Managua%2011125&z=16&output=embed"
  }
};

function clonarDatos(datos) {
  return JSON.parse(JSON.stringify(datos));
}

function normalizarEventos(eventos = []) {
  return eventos.map((evento) => ({
    id: evento.id || Date.now(),
    titulo: evento.titulo || "",
    fecha: evento.fecha || "",
    hora: evento.hora || "",
    estado: evento.estado || "Próximamente",
    descripcion: evento.descripcion || "",
    imagen: evento.imagen || "",
    banner: evento.banner || "",
    video: evento.video || ""
  }));
}

function combinarDatos(base, nuevos = {}) {
  return {
    ...clonarDatos(base),
    ...nuevos,

    faq: Array.isArray(nuevos.faq) ? nuevos.faq : clonarDatos(base.faq),

    horarios: {
      ...clonarDatos(base.horarios),
      ...(nuevos.horarios || {})
    },

    servicios: Array.isArray(nuevos.servicios)
      ? nuevos.servicios
      : clonarDatos(base.servicios),

    eventos: Array.isArray(nuevos.eventos)
      ? normalizarEventos(nuevos.eventos)
      : clonarDatos(base.eventos),

    contacto: {
      ...clonarDatos(base.contacto),
      ...(nuevos.contacto || {})
    },

    promo: nuevos.promo || ""
  };
}

function getSiteData() {
  const saved = localStorage.getItem(EL_CIRCULO_DATA_KEY);

  if (!saved) {
    localStorage.setItem(EL_CIRCULO_DATA_KEY, JSON.stringify(defaultSiteData));
    return clonarDatos(defaultSiteData);
  }

  try {
    const parsed = JSON.parse(saved);
    return combinarDatos(defaultSiteData, parsed);
  } catch (error) {
    console.error("Error leyendo localStorage:", error);
    localStorage.setItem(EL_CIRCULO_DATA_KEY, JSON.stringify(defaultSiteData));
    return clonarDatos(defaultSiteData);
  }
}

async function saveSiteData(data) {
  const datosCompletos = combinarDatos(defaultSiteData, data);

  localStorage.setItem(EL_CIRCULO_DATA_KEY, JSON.stringify(datosCompletos));

  if (window.FirebaseDB) {
    const ref = window.FirebaseDB.doc(
      window.FirebaseDB.db,
      "configuracion",
      "siteData"
    );

    await window.FirebaseDB.setDoc(ref, datosCompletos);
  }

  return datosCompletos;
}

async function cargarDatosDesdeFirebase() {
  if (!window.FirebaseDB) {
    return getSiteData();
  }

  try {
    const ref = window.FirebaseDB.doc(
      window.FirebaseDB.db,
      "configuracion",
      "siteData"
    );

    const snap = await window.FirebaseDB.getDoc(ref);

    if (snap.exists()) {
      const datosFirebase = combinarDatos(defaultSiteData, snap.data());

      localStorage.setItem(
        EL_CIRCULO_DATA_KEY,
        JSON.stringify(datosFirebase)
      );

      return datosFirebase;
    }

    await window.FirebaseDB.setDoc(ref, defaultSiteData);

    localStorage.setItem(
      EL_CIRCULO_DATA_KEY,
      JSON.stringify(defaultSiteData)
    );

    return clonarDatos(defaultSiteData);
  } catch (error) {
    console.error("Error cargando datos desde Firebase:", error);
    return getSiteData();
  }
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

function getPromo() {
  return getSiteData().promo || "";
}

function getFAQ() {
  return getSiteData().faq || [];
}

async function guardarServicios(servicios) {
  const data = getSiteData();
  data.servicios = servicios;
  await saveSiteData(data);
}

async function guardarHorarios(horarios) {
  const data = getSiteData();
  data.horarios = horarios;
  await saveSiteData(data);
}

async function guardarEventos(eventos) {
  const data = getSiteData();
  data.eventos = eventos;
  await saveSiteData(data);
}

async function guardarContacto(contacto) {
  const data = getSiteData();
  data.contacto = contacto;
  await saveSiteData(data);
}

async function guardarPromo(promo) {
  const data = getSiteData();
  data.promo = promo;
  await saveSiteData(data);
}

async function guardarFAQ(faq) {
  const data = getSiteData();
  data.faq = faq;
  await saveSiteData(data);
}

async function restaurarDatosIniciales() {
  localStorage.setItem(EL_CIRCULO_DATA_KEY, JSON.stringify(defaultSiteData));

  if (window.FirebaseDB) {
    const ref = window.FirebaseDB.doc(
      window.FirebaseDB.db,
      "configuracion",
      "siteData"
    );

    await window.FirebaseDB.setDoc(ref, defaultSiteData);
  }
}

function obtenerDiaSemana(fechaISO) {
  const fecha = new Date(`${fechaISO}T00:00:00`);
  const dias = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];

  return dias[fecha.getDay()];
}

function horaAMinutos(hora) {
  if (!hora) return 0;

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
      mensaje: "Ese día el local está cerrado."
    };
  }

  const horaReserva = horaAMinutos(hora);
  const horaInicio = horaAMinutos(horarioDia.inicio);
  const horaFin = horaAMinutos(horarioDia.fin);

  if (horaReserva < horaInicio || horaReserva > horaFin) {
    return {
      valido: false,
      mensaje: `No puedes agendar fuera del horario de atención. Ese día atendemos de ${horarioDia.texto}.`
    };
  }

  return {
    valido: true,
    mensaje: "Horario válido."
  };
}

function convertirArchivoABase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }

    if (file.size > 700 * 1024) {
      reject("La imagen es muy pesada. Usa una imagen menor a 700 KB.");
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
  cargarDatosDesdeFirebase,

  getServicios,
  getServicioById,
  getHorarios,
  getEventos,
  getContacto,
  getPromo,
  getFAQ,

  guardarServicios,
  guardarHorarios,
  guardarEventos,
  guardarContacto,
  guardarPromo,
  guardarFAQ,

  restaurarDatosIniciales,
  estaDentroDelHorario,
  convertirArchivoABase64
};

window.ElCirculoDataReady = new Promise((resolve) => {
  if (window.FirebaseDB) {
    cargarDatosDesdeFirebase().then(resolve);
  } else {
    resolve(getSiteData());

    window.addEventListener("firebase-ready", async () => {
      const datos = await cargarDatosDesdeFirebase();
      resolve(datos);
    });
  }
});