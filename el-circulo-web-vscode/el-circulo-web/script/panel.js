document.addEventListener("DOMContentLoaded", async () => {
  if (window.ElCirculoDataReady) {
    await window.ElCirculoDataReady;
  }

  configurarCerrarSesion();
  configurarSeccionesPanel();

  configurarEventos();
  configurarHorarios();
  configurarPromos();
  configurarServicios();
  configurarContacto();
  configurarRespaldo();
  configurarFAQ();
  configurarSeguridadAdmin();

  configurarPreviewImagenEvento();
});

/* CERRAR SESIÓN */

function configurarCerrarSesion() {
  const btnCerrar = document.getElementById("cerrarSesionAdmin");

  if (!btnCerrar) return;

  btnCerrar.addEventListener("click", () => {
    localStorage.removeItem("rolActivo");
    localStorage.removeItem("adminLoginTime");
    window.location.href = "inicio.html";
  });
}

/* SECCIONES DEL PANEL */

function configurarSeccionesPanel() {
  const tarjetas = document.querySelectorAll(".admin-dashboard-card");
  const secciones = document.querySelectorAll(".admin-section");

  tarjetas.forEach((tarjeta) => {
    tarjeta.addEventListener("click", () => {
      const seccionActiva = tarjeta.dataset.adminSection;

      tarjetas.forEach((item) => item.classList.remove("active"));
      secciones.forEach((seccion) => seccion.classList.remove("active"));

      tarjeta.classList.add("active");

      const section = document.getElementById(`section-${seccionActiva}`);
      if (!section) return;

      section.classList.add("active");

      if (seccionActiva === "eventos") renderizarEventos();
      if (seccionActiva === "horarios") cargarHorarios();
      if (seccionActiva === "promos") renderizarPromocionesAdmin();
      if (seccionActiva === "servicios") cargarSelectServicios();
      if (seccionActiva === "contacto") cargarContacto();
      if (seccionActiva === "faq") renderizarFAQ();
      if (seccionActiva === "seguridad") cargarCredencialesAdmin();
    });
  });
}

/* UTILIDADES */

function escapeHTML(texto = "") {
  return String(texto)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function subirArchivoSupabase(file, carpeta) {
  if (!file) return "";

  if (!window.supabase || !window.SupabaseConfig) {
    throw new Error("Supabase no está cargado.");
  }

  const supabaseClient = window.supabase.createClient(
    window.SupabaseConfig.url,
    window.SupabaseConfig.key
  );

  const extension = file.name.split(".").pop();
  const nombreArchivo = `${carpeta}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.${extension}`;

  const { error } = await supabaseClient.storage
    .from(window.SupabaseConfig.bucket)
    .upload(nombreArchivo, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabaseClient.storage
    .from(window.SupabaseConfig.bucket)
    .getPublicUrl(nombreArchivo);

  return data.publicUrl;
}

function configurarPreviewArchivo(inputId, nombreId, previewBoxId, previewImgId, textoVacio) {
  const input = document.getElementById(inputId);
  const nombre = document.getElementById(nombreId);
  const previewBox = document.getElementById(previewBoxId);
  const previewImg = document.getElementById(previewImgId);

  if (!input || !previewBox || !previewImg) return;

  input.addEventListener("change", () => {
    const archivo = input.files[0];

    if (!archivo) {
      if (nombre) nombre.textContent = textoVacio;
      previewBox.classList.remove("active");
      previewImg.removeAttribute("src");
      return;
    }

    if (nombre) nombre.textContent = archivo.name;

    const reader = new FileReader();

    reader.onload = () => {
      previewImg.src = reader.result;
      previewBox.classList.add("active");
    };

    reader.readAsDataURL(archivo);
  });
}

/* EVENTOS */

function obtenerEventos() {
  return window.ElCirculoData.getEventos();
}

async function guardarEventos(eventos) {
  await window.ElCirculoData.guardarEventos(eventos);
}

function configurarEventos() {
  const formEvento = document.getElementById("formEvento");
  const btnLimpiar = document.getElementById("limpiarEvento");

  if (!formEvento) return;

  formEvento.addEventListener("submit", async (event) => {
    event.preventDefault();
    await guardarEvento();
  });

  if (btnLimpiar) {
    btnLimpiar.addEventListener("click", limpiarFormularioEvento);
  }
}

function configurarPreviewImagenEvento() {
  configurarPreviewArchivo(
    "eventoImagen",
    "eventoImagenNombre",
    "eventoImagenPreviewBox",
    "eventoImagenPreview",
    "Sin imagen seleccionada"
  );

  configurarPreviewArchivo(
    "eventoBannerFile",
    "eventoBannerNombre",
    "eventoBannerPreviewBox",
    "eventoBannerPreview",
    "Sin banner seleccionado"
  );

  configurarPreviewArchivo(
    "eventoResultadoImagen",
    "eventoResultadoImagenNombre",
    "eventoResultadoImagenPreviewBox",
    "eventoResultadoImagenPreview",
    "Sin imagen seleccionada"
  );
}

async function guardarEvento() {
  const id = document.getElementById("eventoId").value;
  const titulo = document.getElementById("eventoTitulo").value.trim();
  const fecha = document.getElementById("eventoFecha").value;
  const hora = document.getElementById("eventoHora").value;
  const estado = document.getElementById("eventoEstado").value;
  const descripcion = document.getElementById("eventoDescripcion").value.trim();
  const video = document.getElementById("eventoVideo")?.value.trim() || "";

  const resultadoDescripcion =
    document.getElementById("eventoResultadoDescripcion")?.value.trim() || "";

  const imagenFile = document.getElementById("eventoImagen")?.files[0];
  const bannerFile = document.getElementById("eventoBannerFile")?.files[0];
  const resultadoImagenFile = document.getElementById("eventoResultadoImagen")?.files[0];

  if (!titulo || !fecha || !hora || !descripcion) {
    alert("Completa título, fecha, hora y descripción del evento.");
    return;
  }

  try {
    const eventos = obtenerEventos();

    let imagenUrl = "";
    let bannerUrl = "";
    let resultadoImagenUrl = "";

    if (imagenFile) {
      imagenUrl = await subirArchivoSupabase(imagenFile, "imagenes-eventos");
    }

    if (bannerFile) {
      bannerUrl = await subirArchivoSupabase(bannerFile, "banners-eventos");
    }

    if (resultadoImagenFile) {
      resultadoImagenUrl = await subirArchivoSupabase(
        resultadoImagenFile,
        "resultados-eventos"
      );
    }

    if (id) {
      const eventosActualizados = eventos.map((evento) => {
        if (String(evento.id) !== String(id)) return evento;

        return {
          ...evento,
          titulo,
          fecha,
          hora,
          estado,
          descripcion,
          video,
          imagen: imagenUrl || evento.imagen || "",
          banner: bannerUrl || evento.banner || "",
          resultadoDescripcion,
          resultadoImagen: resultadoImagenUrl || evento.resultadoImagen || "",
        };
      });

      await guardarEventos(eventosActualizados);
    } else {
      const nuevoEvento = {
        id: Date.now(),
        titulo,
        fecha,
        hora,
        estado,
        descripcion,
        imagen: imagenUrl || "",
        banner: bannerUrl || "",
        video,
        resultadoDescripcion,
        resultadoImagen: resultadoImagenUrl || "",
      };

      eventos.push(nuevoEvento);
      await guardarEventos(eventos);
    }

    limpiarFormularioEvento();
    renderizarEventos();

    alert("Evento guardado correctamente.");
  } catch (error) {
    console.error(error);
    alert(error.message || "No se pudo guardar el evento.");
  }
}

function renderizarEventos() {
  const lista = document.getElementById("listaEventos");
  if (!lista) return;

  const eventos = obtenerEventos();

  if (!eventos.length) {
    lista.innerHTML = `
      <div class="admin-empty-state">
        <h3>No hay eventos registrados</h3>
        <p>Agrega el primer evento desde el formulario superior.</p>
      </div>
    `;
    return;
  }

  lista.innerHTML = eventos
    .map((evento) => `
      <article class="admin-event-item">
        <div>
          <span class="admin-event-status">${escapeHTML(evento.estado)}</span>
          <h3>${escapeHTML(evento.titulo)}</h3>
          <p>${escapeHTML(evento.descripcion)}</p>
          <small>${escapeHTML(evento.fecha)} · ${escapeHTML(evento.hora)}</small>

          ${evento.imagen ? `<br><small>Imagen del evento cargada</small>` : ""}
          ${evento.banner ? `<br><small>Banner cargado</small>` : ""}
          ${evento.resultadoImagen ? `<br><small>Imagen de resultado cargada</small>` : ""}
          ${evento.resultadoDescripcion ? `<br><small>Resultado escrito</small>` : ""}
          ${evento.video ? `<br><small>Video: ${escapeHTML(evento.video)}</small>` : ""}
        </div>

        <div class="admin-event-actions">
          <button onclick="editarEvento(${Number(evento.id)})">Editar</button>
          <button class="danger" onclick="eliminarEvento(${Number(evento.id)})">Eliminar</button>
        </div>
      </article>
    `)
    .join("");
}

function editarEvento(id) {
  const evento = obtenerEventos().find((item) => String(item.id) === String(id));
  if (!evento) return;

  document.getElementById("eventoId").value = evento.id;
  document.getElementById("eventoTitulo").value = evento.titulo || "";
  document.getElementById("eventoFecha").value = evento.fecha || "";
  document.getElementById("eventoHora").value = evento.hora || "";
  document.getElementById("eventoEstado").value = evento.estado || "Próximamente";
  document.getElementById("eventoDescripcion").value = evento.descripcion || "";

  const videoInput = document.getElementById("eventoVideo");
  if (videoInput) videoInput.value = evento.video || "";

  const resultadoDescripcionInput = document.getElementById("eventoResultadoDescripcion");
  if (resultadoDescripcionInput) {
    resultadoDescripcionInput.value = evento.resultadoDescripcion || "";
  }

  precargarPreviewEvento(
    evento.imagen,
    "eventoImagenNombre",
    "eventoImagenPreviewBox",
    "eventoImagenPreview",
    "Imagen actual del evento",
    "Sin imagen seleccionada"
  );

  precargarPreviewEvento(
    evento.banner,
    "eventoBannerNombre",
    "eventoBannerPreviewBox",
    "eventoBannerPreview",
    "Banner actual del evento",
    "Sin banner seleccionado"
  );

  precargarPreviewEvento(
    evento.resultadoImagen,
    "eventoResultadoImagenNombre",
    "eventoResultadoImagenPreviewBox",
    "eventoResultadoImagenPreview",
    "Imagen actual del resultado",
    "Sin imagen seleccionada"
  );

  abrirSeccionPanel("eventos");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function precargarPreviewEvento(url, nombreId, boxId, imgId, textoActual, textoVacio) {
  const nombre = document.getElementById(nombreId);
  const box = document.getElementById(boxId);
  const img = document.getElementById(imgId);

  if (url && box && img) {
    img.src = url;
    box.classList.add("active");
    if (nombre) nombre.textContent = textoActual;
  } else {
    if (box) box.classList.remove("active");
    if (img) img.removeAttribute("src");
    if (nombre) nombre.textContent = textoVacio;
  }
}

async function eliminarEvento(id) {
  const confirmar = confirm("¿Seguro que deseas eliminar este evento?");
  if (!confirmar) return;

  const eventos = obtenerEventos().filter((evento) => String(evento.id) !== String(id));

  await guardarEventos(eventos);
  renderizarEventos();
}

function limpiarFormularioEvento() {
  const formEvento = document.getElementById("formEvento");
  if (formEvento) formEvento.reset();

  const eventoId = document.getElementById("eventoId");
  if (eventoId) eventoId.value = "";

  precargarPreviewEvento(
    "",
    "eventoImagenNombre",
    "eventoImagenPreviewBox",
    "eventoImagenPreview",
    "",
    "Sin imagen seleccionada"
  );

  precargarPreviewEvento(
    "",
    "eventoBannerNombre",
    "eventoBannerPreviewBox",
    "eventoBannerPreview",
    "",
    "Sin banner seleccionado"
  );

  precargarPreviewEvento(
    "",
    "eventoResultadoImagenNombre",
    "eventoResultadoImagenPreviewBox",
    "eventoResultadoImagenPreview",
    "",
    "Sin imagen seleccionada"
  );
}

/* HORARIOS */

function configurarHorarios() {
  const formHorario = document.getElementById("formHorario");
  if (!formHorario) return;

  formHorario.innerHTML = `
    <div class="form-grid">
      ${["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"]
        .map((dia) => `
          <div class="form-group">
            <label>${dia.toUpperCase()}</label>
            <select id="${dia}Abierto">
              <option value="true">Abierto</option>
              <option value="false">Cerrado</option>
            </select>
            <input type="time" id="${dia}Inicio">
            <input type="time" id="${dia}Fin">
            <input type="text" id="${dia}Texto" placeholder="Ej: 8:00 a.m.–8:00 p.m.">
          </div>
        `)
        .join("")}
    </div>

    <div class="admin-form-actions">
      <button type="submit" class="admin-main-btn">Guardar horarios</button>
    </div>
  `;

  formHorario.addEventListener("submit", async (event) => {
    event.preventDefault();

    const dias = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
    const horarios = {};

    dias.forEach((dia) => {
      horarios[dia] = {
        abierto: document.getElementById(`${dia}Abierto`).value === "true",
        inicio: document.getElementById(`${dia}Inicio`).value,
        fin: document.getElementById(`${dia}Fin`).value,
        texto: document.getElementById(`${dia}Texto`).value.trim(),
      };
    });

    await window.ElCirculoData.guardarHorarios(horarios);
    alert("Horarios guardados correctamente.");
  });
}

function cargarHorarios() {
  const horarios = window.ElCirculoData.getHorarios();

  Object.entries(horarios).forEach(([dia, info]) => {
    const abierto = document.getElementById(`${dia}Abierto`);
    const inicio = document.getElementById(`${dia}Inicio`);
    const fin = document.getElementById(`${dia}Fin`);
    const texto = document.getElementById(`${dia}Texto`);

    if (abierto) abierto.value = String(info.abierto);
    if (inicio) inicio.value = info.inicio || "";
    if (fin) fin.value = info.fin || "";
    if (texto) texto.value = info.texto || "";
  });
}

/* PROMOCIONES */

function obtenerPromociones() {
  return window.ElCirculoData.getPromociones();
}

async function guardarPromocionesDatos(promociones) {
  await window.ElCirculoData.guardarPromociones(promociones);
}

function configurarPromos() {
  const formPromo = document.getElementById("formPromo");
  const btnLimpiar = document.getElementById("limpiarPromo");

  if (!formPromo) return;

  formPromo.addEventListener("submit", async (event) => {
    event.preventDefault();
    await guardarPromocion();
  });

  if (btnLimpiar) {
    btnLimpiar.addEventListener("click", limpiarFormularioPromo);
  }
}

async function guardarPromocion() {
  const id = document.getElementById("promoId").value;
  const titulo = document.getElementById("promoTitulo").value.trim();
  const descripcion = document.getElementById("promoDescripcion").value.trim();
  const activa = document.getElementById("promoActiva").value === "true";

  if (!titulo || !descripcion) {
    alert("Completa el título y la descripción de la promoción.");
    return;
  }

  const promociones = obtenerPromociones();

  if (id) {
    const actualizadas = promociones.map((promo) => {
      if (String(promo.id) !== String(id)) return promo;
      return { ...promo, titulo, descripcion, activa };
    });

    await guardarPromocionesDatos(actualizadas);
  } else {
    promociones.push({
      id: Date.now(),
      titulo,
      descripcion,
      activa,
    });

    await guardarPromocionesDatos(promociones);
  }

  limpiarFormularioPromo();
  renderizarPromocionesAdmin();

  alert("Promoción guardada correctamente.");
}

function renderizarPromocionesAdmin() {
  const lista = document.getElementById("listaPromociones");
  if (!lista) return;

  const promociones = obtenerPromociones();

  if (!promociones.length) {
    lista.innerHTML = `
      <div class="admin-empty-state">
        <h3>No hay promociones registradas</h3>
        <p>Agrega la primera promoción desde el formulario.</p>
      </div>
    `;
    return;
  }

  lista.innerHTML = promociones
    .map((promo) => `
      <article class="admin-event-item">
        <div>
          <span class="admin-event-status">${promo.activa !== false ? "Activa" : "Inactiva"}</span>
          <h3>${escapeHTML(promo.titulo)}</h3>
          <p>${escapeHTML(promo.descripcion)}</p>
        </div>

        <div class="admin-event-actions">
          <button onclick="editarPromocion(${Number(promo.id)})">Editar</button>
          <button class="danger" onclick="eliminarPromocion(${Number(promo.id)})">Eliminar</button>
        </div>
      </article>
    `)
    .join("");
}

function editarPromocion(id) {
  const promo = obtenerPromociones().find((item) => String(item.id) === String(id));
  if (!promo) return;

  document.getElementById("promoId").value = promo.id;
  document.getElementById("promoTitulo").value = promo.titulo || "";
  document.getElementById("promoDescripcion").value = promo.descripcion || "";
  document.getElementById("promoActiva").value = String(promo.activa !== false);

  abrirSeccionPanel("promos");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function eliminarPromocion(id) {
  const confirmar = confirm("¿Seguro que deseas eliminar esta promoción?");
  if (!confirmar) return;

  const promociones = obtenerPromociones().filter((promo) => String(promo.id) !== String(id));

  await guardarPromocionesDatos(promociones);
  renderizarPromocionesAdmin();
}

function limpiarFormularioPromo() {
  const formPromo = document.getElementById("formPromo");
  if (formPromo) formPromo.reset();

  const promoId = document.getElementById("promoId");
  if (promoId) promoId.value = "";

  const promoActiva = document.getElementById("promoActiva");
  if (promoActiva) promoActiva.value = "true";
}

/* SERVICIOS */

function configurarServicios() {
  const servicioSelect = document.getElementById("servicioSelect");
  const formServicio = document.getElementById("formServicio");

  if (!servicioSelect || !formServicio) return;

  servicioSelect.addEventListener("change", () => {
    cargarServicioEnFormulario(servicioSelect.value);
  });

  formServicio.addEventListener("submit", async (event) => {
    event.preventDefault();
    await guardarServicioEditado();
  });
}

function cargarSelectServicios() {
  const servicioSelect = document.getElementById("servicioSelect");
  if (!servicioSelect) return;

  const servicios = window.ElCirculoData.getServicios();

  servicioSelect.innerHTML = servicios
    .map((servicio) => `<option value="${servicio.id}">${escapeHTML(servicio.title)}</option>`)
    .join("");

  if (servicios[0]) cargarServicioEnFormulario(servicios[0].id);
}

function cargarServicioEnFormulario(id) {
  const servicio = window.ElCirculoData.getServicioById(id);
  if (!servicio) return;

  document.getElementById("servicioId").value = servicio.id;
  document.getElementById("servicioTitulo").value = servicio.title || "";
  document.getElementById("servicioTag").value = servicio.tag || "";
  document.getElementById("servicioPrecioTexto").value = servicio.details?.precio || "";
  document.getElementById("servicioShort").value = servicio.short || "";
  document.getElementById("servicioDescripcion").value = servicio.details?.descripcion || "";
  document.getElementById("servicioJuegos").value = (servicio.details?.juegos || []).join("\n");
  document.getElementById("servicioEquipos").value = (servicio.details?.equipos || []).join("\n");
  document.getElementById("servicioReglas").value = (servicio.details?.reglas || []).join("\n");

  const precioNumero = document.getElementById("servicioPrecioNumero");

  if (servicio.tipoAgenda === "gaming") {
    precioNumero.value = servicio.precioHoraPersona || 0;
  } else if (servicio.tipoAgenda === "mantenimiento") {
    precioNumero.value = servicio.precioDiagnostico || 0;
  } else if (servicio.tipoAgenda === "liberacion") {
    precioNumero.value = servicio.precioLiberacion || 0;
  } else {
    precioNumero.value = 0;
  }
}

async function guardarServicioEditado() {
  const servicios = window.ElCirculoData.getServicios();
  const id = document.getElementById("servicioId").value;
  const imagenFile = document.getElementById("servicioImagen")?.files[0];

  try {
    let imagenUrl = "";

    if (imagenFile) {
      imagenUrl = await subirArchivoSupabase(imagenFile, "imagenes-servicios");
    }

    const serviciosActualizados = servicios.map((servicio) => {
      if (String(servicio.id) !== String(id)) return servicio;

      const precioNumero = Number(document.getElementById("servicioPrecioNumero").value || 0);

      const actualizado = {
        ...servicio,
        title: document.getElementById("servicioTitulo").value.trim(),
        tag: document.getElementById("servicioTag").value.trim(),
        short: document.getElementById("servicioShort").value.trim(),
        imagen: imagenUrl || servicio.imagen || "",
        details: {
          ...servicio.details,
          precio: document.getElementById("servicioPrecioTexto").value.trim(),
          descripcion: document.getElementById("servicioDescripcion").value.trim(),
          juegos: document
            .getElementById("servicioJuegos")
            .value.split("\n")
            .map((x) => x.trim())
            .filter(Boolean),
          equipos: document
            .getElementById("servicioEquipos")
            .value.split("\n")
            .map((x) => x.trim())
            .filter(Boolean),
          reglas: document
            .getElementById("servicioReglas")
            .value.split("\n")
            .map((x) => x.trim())
            .filter(Boolean),
        },
      };

      if (servicio.tipoAgenda === "gaming") actualizado.precioHoraPersona = precioNumero;
      if (servicio.tipoAgenda === "mantenimiento") actualizado.precioDiagnostico = precioNumero;
      if (servicio.tipoAgenda === "liberacion") actualizado.precioLiberacion = precioNumero;

      return actualizado;
    });

    await window.ElCirculoData.guardarServicios(serviciosActualizados);
    cargarSelectServicios();

    alert("Servicio guardado correctamente.");
  } catch (error) {
    console.error(error);
    alert(error.message || "No se pudo guardar el servicio.");
  }
}

/* CONTACTO Y SUGERENCIAS */

const CONTACTO_DEFAULT_PANEL = {
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

function obtenerContactoPanel() {
  const contacto = window.ElCirculoData.getContacto();

  return {
    ...CONTACTO_DEFAULT_PANEL,
    ...(contacto || {}),
    categoriasSugerencia: Array.isArray(contacto?.categoriasSugerencia)
      ? contacto.categoriasSugerencia
      : CONTACTO_DEFAULT_PANEL.categoriasSugerencia,
    sugerenciaIdeas: Array.isArray(contacto?.sugerenciaIdeas)
      ? contacto.sugerenciaIdeas
      : CONTACTO_DEFAULT_PANEL.sugerenciaIdeas
  };
}

function setCampo(id, valor) {
  const campo = document.getElementById(id);
  if (campo) campo.value = valor || "";
}

function getCampo(id) {
  const campo = document.getElementById(id);
  return campo ? campo.value.trim() : "";
}

function textoALista(texto) {
  return String(texto || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function listaATexto(lista) {
  return Array.isArray(lista) ? lista.join("\n") : "";
}

function configurarContacto() {
  const formContacto = document.getElementById("formContacto");
  if (!formContacto) return;

  formContacto.addEventListener("submit", async (event) => {
    event.preventDefault();

    const contactoAnterior = obtenerContactoPanel();

    const contacto = {
      ...contactoAnterior,

      facebookTexto: getCampo("facebookTexto"),
      facebookUrl: getCampo("facebookUrl"),
      instagramTexto: getCampo("instagramTexto"),
      instagramUrl: getCampo("instagramUrl"),
      tiktokTexto: getCampo("tiktokTexto"),
      tiktokUrl: getCampo("tiktokUrl"),
      telefonoTexto: getCampo("telefonoTexto"),
      telefonoUrl: getCampo("telefonoUrl"),
      correoNegocio: getCampo("correoNegocio"),
      direccion: getCampo("direccionContacto"),
      mapaUrl: getCampo("mapaUrl"),

      contactoPageTitle: getCampo("contactoPageTitle"),
      contactoPageDescription: getCampo("contactoPageDescription"),
      contactoInfoTitle: getCampo("contactoInfoTitle"),
      contactoFormTitle: getCampo("contactoFormTitle"),
      contactoSubmitText: getCampo("contactoSubmitText"),
      contactoMessageLabel: getCampo("contactoMessageLabel"),
      contactoMessagePlaceholder: getCampo("contactoMessagePlaceholder"),

      sugerenciaPageTitle: getCampo("sugerenciaPageTitle"),
      sugerenciaPageDescription: getCampo("sugerenciaPageDescription"),
      sugerenciaInfoTitle: getCampo("sugerenciaInfoTitle"),
      sugerenciaFormTitle: getCampo("sugerenciaFormTitle"),
      sugerenciaSubmitText: getCampo("sugerenciaSubmitText"),
      sugerenciaMessageLabel: getCampo("sugerenciaMessageLabel"),
      sugerenciaMessagePlaceholder: getCampo("sugerenciaMessagePlaceholder"),

      categoriasSugerencia: textoALista(getCampo("categoriasSugerencia")),
      sugerenciaIdeas: [
        getCampo("sugerenciaIdea1"),
        getCampo("sugerenciaIdea2"),
        getCampo("sugerenciaIdea3")
      ].filter(Boolean)
    };

    await window.ElCirculoData.guardarContacto(contacto);

    alert("Contacto y sugerencias guardados correctamente.");
  });
}

function cargarContacto() {
  if (!document.getElementById("formContacto")) return;

  const contacto = obtenerContactoPanel();

  setCampo("facebookTexto", contacto.facebookTexto);
  setCampo("facebookUrl", contacto.facebookUrl);
  setCampo("instagramTexto", contacto.instagramTexto);
  setCampo("instagramUrl", contacto.instagramUrl);
  setCampo("tiktokTexto", contacto.tiktokTexto);
  setCampo("tiktokUrl", contacto.tiktokUrl);
  setCampo("telefonoTexto", contacto.telefonoTexto);
  setCampo("telefonoUrl", contacto.telefonoUrl);
  setCampo("correoNegocio", contacto.correoNegocio);
  setCampo("direccionContacto", contacto.direccion);
  setCampo("mapaUrl", contacto.mapaUrl);

  setCampo("contactoPageTitle", contacto.contactoPageTitle);
  setCampo("contactoPageDescription", contacto.contactoPageDescription);
  setCampo("contactoInfoTitle", contacto.contactoInfoTitle);
  setCampo("contactoFormTitle", contacto.contactoFormTitle);
  setCampo("contactoSubmitText", contacto.contactoSubmitText);
  setCampo("contactoMessageLabel", contacto.contactoMessageLabel);
  setCampo("contactoMessagePlaceholder", contacto.contactoMessagePlaceholder);

  setCampo("sugerenciaPageTitle", contacto.sugerenciaPageTitle);
  setCampo("sugerenciaPageDescription", contacto.sugerenciaPageDescription);
  setCampo("sugerenciaInfoTitle", contacto.sugerenciaInfoTitle);
  setCampo("sugerenciaFormTitle", contacto.sugerenciaFormTitle);
  setCampo("sugerenciaSubmitText", contacto.sugerenciaSubmitText);
  setCampo("sugerenciaMessageLabel", contacto.sugerenciaMessageLabel);
  setCampo("sugerenciaMessagePlaceholder", contacto.sugerenciaMessagePlaceholder);

  setCampo("categoriasSugerencia", listaATexto(contacto.categoriasSugerencia));

  setCampo("sugerenciaIdea1", contacto.sugerenciaIdeas?.[0] || "");
  setCampo("sugerenciaIdea2", contacto.sugerenciaIdeas?.[1] || "");
  setCampo("sugerenciaIdea3", contacto.sugerenciaIdeas?.[2] || "");
}

/* RESPALDO */

function configurarRespaldo() {
  const btnExportar = document.getElementById("exportarDatos");
  const btnRestaurar = document.getElementById("restaurarDatos");

  if (btnExportar) btnExportar.addEventListener("click", exportarDatos);
  if (btnRestaurar) btnRestaurar.addEventListener("click", restaurarDatos);
}

function exportarDatos() {
  const datos = window.ElCirculoData.getSiteData();

  const archivo = new Blob([JSON.stringify(datos, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(archivo);
  const enlace = document.createElement("a");

  enlace.href = url;
  enlace.download = "respaldo-el-circulo.json";
  enlace.click();

  URL.revokeObjectURL(url);
}

async function restaurarDatos() {
  const confirmar = confirm("Esto restaurará los datos iniciales. ¿Deseas continuar?");
  if (!confirmar) return;

  await window.ElCirculoData.restaurarDatosIniciales();

  alert("Datos restaurados correctamente.");
  location.reload();
}

/* FAQ */

function obtenerFAQ() {
  return window.ElCirculoData.getFAQ();
}

async function guardarFAQDatos(faq) {
  await window.ElCirculoData.guardarFAQ(faq);
}

function configurarFAQ() {
  const formFAQ = document.getElementById("formFAQ");
  const btnLimpiar = document.getElementById("limpiarFAQ");

  if (!formFAQ) return;

  formFAQ.addEventListener("submit", async (event) => {
    event.preventDefault();
    await guardarPreguntaFAQ();
  });

  if (btnLimpiar) {
    btnLimpiar.addEventListener("click", limpiarFormularioFAQ);
  }
}

async function guardarPreguntaFAQ() {
  const id = document.getElementById("faqId").value;
  const pregunta = document.getElementById("faqPregunta").value.trim();
  const respuesta = document.getElementById("faqRespuesta").value.trim();

  if (!pregunta || !respuesta) {
    alert("Completa la pregunta y la respuesta.");
    return;
  }

  const faq = obtenerFAQ();

  if (id) {
    const faqActualizado = faq.map((item) =>
      String(item.id) === String(id)
        ? { ...item, pregunta, respuesta }
        : item
    );

    await guardarFAQDatos(faqActualizado);
  } else {
    faq.push({
      id: Date.now(),
      pregunta,
      respuesta,
    });

    await guardarFAQDatos(faq);
  }

  limpiarFormularioFAQ();
  renderizarFAQ();

  alert("Pregunta guardada correctamente.");
}

function renderizarFAQ() {
  const lista = document.getElementById("listaFAQ");
  if (!lista) return;

  const faq = obtenerFAQ();

  if (!faq.length) {
    lista.innerHTML = `
      <div class="admin-empty-state">
        <h3>No hay preguntas registradas</h3>
        <p>Agrega la primera pregunta desde el formulario.</p>
      </div>
    `;
    return;
  }

  lista.innerHTML = faq
    .map((item) => `
      <article class="admin-event-item">
        <div>
          <h3>${escapeHTML(item.pregunta)}</h3>
          <p>${escapeHTML(item.respuesta)}</p>
        </div>

        <div class="admin-event-actions">
          <button onclick="editarFAQ(${Number(item.id)})">Editar</button>
          <button class="danger" onclick="eliminarFAQ(${Number(item.id)})">Eliminar</button>
        </div>
      </article>
    `)
    .join("");
}

function editarFAQ(id) {
  const item = obtenerFAQ().find((faq) => String(faq.id) === String(id));
  if (!item) return;

  document.getElementById("faqId").value = item.id;
  document.getElementById("faqPregunta").value = item.pregunta || "";
  document.getElementById("faqRespuesta").value = item.respuesta || "";

  abrirSeccionPanel("faq");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function eliminarFAQ(id) {
  const confirmar = confirm("¿Seguro que deseas eliminar esta pregunta?");
  if (!confirmar) return;

  const faq = obtenerFAQ().filter((item) => String(item.id) !== String(id));

  await guardarFAQDatos(faq);
  renderizarFAQ();
}

function limpiarFormularioFAQ() {
  const formFAQ = document.getElementById("formFAQ");
  if (formFAQ) formFAQ.reset();

  const faqId = document.getElementById("faqId");
  if (faqId) faqId.value = "";
}

/* SEGURIDAD ADMIN */

function configurarSeguridadAdmin() {
  const formSeguridad = document.getElementById("formSeguridad");

  if (!formSeguridad) return;

  formSeguridad.addEventListener("submit", async (event) => {
    event.preventDefault();

    const usuario = document.getElementById("adminUsuarioNuevo").value.trim().toUpperCase();
    const password = document.getElementById("adminPasswordNuevo").value.trim();

    if (!usuario || !password) {
      alert("Completa usuario y contraseña.");
      return;
    }

    await window.ElCirculoData.guardarAdminCredenciales({
      usuario,
      password,
    });

    alert("Credenciales actualizadas correctamente.");
    formSeguridad.reset();
    cargarCredencialesAdmin();
  });
}

function cargarCredencialesAdmin() {
  if (!window.ElCirculoData.getAdminCredenciales) return;

  const credenciales = window.ElCirculoData.getAdminCredenciales();

  const usuarioInput = document.getElementById("adminUsuarioNuevo");
  const passwordInput = document.getElementById("adminPasswordNuevo");

  if (usuarioInput) usuarioInput.value = credenciales.usuario || "ADMIN";
  if (passwordInput) passwordInput.value = "";
}

/* ABRIR SECCIÓN DESDE BOTONES DE EDITAR */

function abrirSeccionPanel(nombreSeccion) {
  const tarjetas = document.querySelectorAll(".admin-dashboard-card");
  const secciones = document.querySelectorAll(".admin-section");

  tarjetas.forEach((tarjeta) => {
    tarjeta.classList.toggle("active", tarjeta.dataset.adminSection === nombreSeccion);
  });

  secciones.forEach((seccion) => {
    seccion.classList.toggle("active", seccion.id === `section-${nombreSeccion}`);
  });
}