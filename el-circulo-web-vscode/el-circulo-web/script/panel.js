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
  configurarPreviewImagenEvento();
  configurarFAQ();
});

function configurarCerrarSesion() {
  const btnCerrar = document.getElementById("cerrarSesionAdmin");

  if (!btnCerrar) return;

  btnCerrar.addEventListener("click", () => {

    localStorage.removeItem("rolActivo");
localStorage.removeItem("adminLoginTime");
window.location.href = "inicio.html";
  });
}

function configurarSeccionesPanel() {
  if (seccionActiva === "faq") renderizarFAQ();
  const tarjetas = document.querySelectorAll(".admin-dashboard-card");
  const secciones = document.querySelectorAll(".admin-section");

  tarjetas.forEach((tarjeta) => {
    tarjeta.addEventListener("click", () => {
      const seccionActiva = tarjeta.dataset.adminSection;

      tarjetas.forEach((item) => item.classList.remove("active"));
      tarjeta.classList.add("active");

      secciones.forEach((seccion) => seccion.classList.remove("active"));

      const section = document.getElementById(`section-${seccionActiva}`);
      if (section) {
  section.classList.add("active");

  if (seccionActiva === "eventos") renderizarEventos();
  if (seccionActiva === "horarios") cargarHorarios();
if (seccionActiva === "promos") renderizarPromocionesAdmin();
  if (seccionActiva === "servicios") cargarSelectServicios();
  if (seccionActiva === "contacto") cargarContacto();
}
    });
  });
}function configurarSeccionesPanel() {
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
    });
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
  const inputImagen = document.getElementById("eventoImagen");
  const nombreImagen = document.getElementById("eventoImagenNombre");
  const previewBox = document.getElementById("eventoImagenPreviewBox");
  const previewImg = document.getElementById("eventoImagenPreview");

  if (!inputImagen || !previewBox || !previewImg) return;

  inputImagen.addEventListener("change", () => {
    const archivo = inputImagen.files[0];

    if (!archivo) {
      if (nombreImagen) nombreImagen.textContent = "Sin imagen seleccionada";
      previewBox.classList.remove("active");
      previewImg.removeAttribute("src");
      return;
    }

    if (archivo.size > 700 * 1024) {
      alert("La imagen es muy pesada. Usa una imagen menor a 700 KB.");
      inputImagen.value = "";
      if (nombreImagen) nombreImagen.textContent = "Sin imagen seleccionada";
      previewBox.classList.remove("active");
      previewImg.removeAttribute("src");
      return;
    }

    if (nombreImagen) nombreImagen.textContent = archivo.name;

    const reader = new FileReader();

    reader.onload = () => {
      previewImg.src = reader.result;
      previewBox.classList.add("active");
    };

    reader.readAsDataURL(archivo);
  });

  const inputBanner = document.getElementById("eventoBannerFile");
  const nombreBanner = document.getElementById("eventoBannerNombre");
  const bannerPreviewBox = document.getElementById("eventoBannerPreviewBox");
  const bannerPreviewImg = document.getElementById("eventoBannerPreview");

  if (inputBanner && bannerPreviewBox && bannerPreviewImg) {
    inputBanner.addEventListener("change", () => {
      const archivo = inputBanner.files[0];

      if (!archivo) {
        if (nombreBanner) nombreBanner.textContent = "Sin banner seleccionado";
        bannerPreviewBox.classList.remove("active");
        bannerPreviewImg.removeAttribute("src");
        return;
      }

      if (nombreBanner) nombreBanner.textContent = archivo.name;

      const reader = new FileReader();

      reader.onload = () => {
        bannerPreviewImg.src = reader.result;
        bannerPreviewBox.classList.add("active");
      };

      reader.readAsDataURL(archivo);
    });
  }

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
  const nombreArchivo = `${carpeta}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;

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

async function guardarEvento() {
  const id = document.getElementById("eventoId").value;
  const titulo = document.getElementById("eventoTitulo").value.trim();
  const fecha = document.getElementById("eventoFecha").value;
  const hora = document.getElementById("eventoHora").value;
  const estado = document.getElementById("eventoEstado").value;
  const descripcion = document.getElementById("eventoDescripcion").value.trim();
const video = document.getElementById("eventoVideo")?.value.trim() || "";
  const imagenFile = document.getElementById("eventoImagen")?.files[0];
  const bannerFile = document.getElementById("eventoBannerFile")?.files[0];

  if (!titulo || !fecha || !hora || !descripcion) {
    alert("Completa todos los datos del evento.");
    return;
  }

  try {
    const eventos = obtenerEventos();
  let imagenUrl = "";
let bannerUrl = "";

if (imagenFile) {
  imagenUrl = await subirArchivoSupabase(imagenFile, "imagenes-eventos");
}

if (bannerFile) {
  bannerUrl = await subirArchivoSupabase(bannerFile, "banners-eventos");
}
    if (id) {
      const eventosActualizados = eventos.map((evento) => {
        if (evento.id === Number(id)) {
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
          };
        }

        return evento;
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
      };

      eventos.push(nuevoEvento);
      await guardarEventos(eventos);
    }

    limpiarFormularioEvento();
    renderizarEventos();

    alert("Evento guardado correctamente.");
  } catch (error) {
    console.error(error);
    alert(error || "No se pudo guardar el evento.");
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
          <span class="admin-event-status">${evento.estado}</span>
          <h3>${evento.titulo}</h3>
          <p>${evento.descripcion}</p>
          <small>${evento.fecha} · ${evento.hora}</small>
          ${evento.imagen ? `<br><small>Imagen cargada</small>` : ""}
          ${evento.video ? `<br><small>Video: ${evento.video}</small>` : ""}
        </div>

        <div class="admin-event-actions">
          <button onclick="editarEvento(${evento.id})">Editar</button>
          <button class="danger" onclick="eliminarEvento(${evento.id})">Eliminar</button>
        </div>
      </article>
    `)
    .join("");
}

function editarEvento(id) {
  const evento = obtenerEventos().find((item) => item.id === id);
  if (!evento) return;

  document.getElementById("eventoId").value = evento.id;
  document.getElementById("eventoTitulo").value = evento.titulo;
  document.getElementById("eventoFecha").value = evento.fecha;
  document.getElementById("eventoHora").value = evento.hora;
  document.getElementById("eventoEstado").value = evento.estado;
  document.getElementById("eventoDescripcion").value = evento.descripcion;

 
  const videoInput = document.getElementById("eventoVideo");
  if (videoInput) videoInput.value = evento.video || "";

  const nombreImagen = document.getElementById("eventoImagenNombre");
  const previewBox = document.getElementById("eventoImagenPreviewBox");
  const previewImg = document.getElementById("eventoImagenPreview");

  if (evento.imagen && previewBox && previewImg) {
    previewImg.src = evento.imagen;
    previewBox.classList.add("active");
    if (nombreImagen) nombreImagen.textContent = "Imagen actual del evento";
  } else {
    if (previewBox) previewBox.classList.remove("active");
    if (previewImg) previewImg.removeAttribute("src");
    if (nombreImagen) nombreImagen.textContent = "Sin imagen seleccionada";
  }

  window.scrollTo({ top: 0, behavior: "smooth" });

  const nombreBanner = document.getElementById("eventoBannerNombre");
const bannerPreviewBox = document.getElementById("eventoBannerPreviewBox");
const bannerPreviewImg = document.getElementById("eventoBannerPreview");

if (evento.banner && bannerPreviewBox && bannerPreviewImg) {
  bannerPreviewImg.src = evento.banner;
  bannerPreviewBox.classList.add("active");

  if (nombreBanner) {
    nombreBanner.textContent = "Banner actual del evento";
  }
} else {
  if (bannerPreviewBox) bannerPreviewBox.classList.remove("active");
  if (bannerPreviewImg) bannerPreviewImg.removeAttribute("src");
  if (nombreBanner) nombreBanner.textContent = "Sin banner seleccionado";
}
}

async function eliminarEvento(id) {
  const confirmar = confirm("¿Seguro que deseas eliminar este evento?");
  if (!confirmar) return;

  const eventos = obtenerEventos().filter((evento) => evento.id !== id);
  await guardarEventos(eventos);
  renderizarEventos();
}

function limpiarFormularioEvento() {
  document.getElementById("formEvento").reset();
  document.getElementById("eventoId").value = "";

  const nombreImagen = document.getElementById("eventoImagenNombre");
  const previewBox = document.getElementById("eventoImagenPreviewBox");
  const previewImg = document.getElementById("eventoImagenPreview");

  if (nombreImagen) nombreImagen.textContent = "Sin imagen seleccionada";
  if (previewBox) previewBox.classList.remove("active");
  if (previewImg) previewImg.removeAttribute("src");
  const nombreBanner = document.getElementById("eventoBannerNombre");
const bannerPreviewBox = document.getElementById("eventoBannerPreviewBox");
const bannerPreviewImg = document.getElementById("eventoBannerPreview");

if (nombreBanner) nombreBanner.textContent = "Sin banner seleccionado";
if (bannerPreviewBox) bannerPreviewBox.classList.remove("active");
if (bannerPreviewImg) bannerPreviewImg.removeAttribute("src");
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
      if (Number(promo.id) === Number(id)) {
        return { ...promo, titulo, descripcion, activa };
      }

      return promo;
    });

    await guardarPromocionesDatos(actualizadas);
  } else {
    promociones.push({
      id: Date.now(),
      titulo,
      descripcion,
      activa
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
          <span class="admin-event-status">${promo.activa ? "Activa" : "Inactiva"}</span>
          <h3>${promo.titulo}</h3>
          <p>${promo.descripcion}</p>
        </div>

        <div class="admin-event-actions">
          <button onclick="editarPromocion(${promo.id})">Editar</button>
          <button class="danger" onclick="eliminarPromocion(${promo.id})">Eliminar</button>
        </div>
      </article>
    `)
    .join("");
}

function editarPromocion(id) {
  const promo = obtenerPromociones().find((item) => Number(item.id) === Number(id));
  if (!promo) return;

  document.getElementById("promoId").value = promo.id;
  document.getElementById("promoTitulo").value = promo.titulo;
  document.getElementById("promoDescripcion").value = promo.descripcion;
  document.getElementById("promoActiva").value = String(promo.activa !== false);

  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function eliminarPromocion(id) {
  const confirmar = confirm("¿Seguro que deseas eliminar esta promoción?");
  if (!confirmar) return;

  const promociones = obtenerPromociones().filter((promo) => Number(promo.id) !== Number(id));

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
    .map((servicio) => `<option value="${servicio.id}">${servicio.title}</option>`)
    .join("");

  if (servicios[0]) cargarServicioEnFormulario(servicios[0].id);
}

function cargarServicioEnFormulario(id) {
  const servicio = window.ElCirculoData.getServicioById(id);
  if (!servicio) return;

  document.getElementById("servicioId").value = servicio.id;
  document.getElementById("servicioTitulo").value = servicio.title;
  document.getElementById("servicioTag").value = servicio.tag;
  document.getElementById("servicioPrecioTexto").value = servicio.details.precio;
  document.getElementById("servicioShort").value = servicio.short;
  document.getElementById("servicioDescripcion").value = servicio.details.descripcion;
  document.getElementById("servicioJuegos").value = servicio.details.juegos.join("\n");
  document.getElementById("servicioEquipos").value = servicio.details.equipos.join("\n");
  document.getElementById("servicioReglas").value = servicio.details.reglas.join("\n");

  const precioNumero = document.getElementById("servicioPrecioNumero");

  if (servicio.tipoAgenda === "gaming") {
    precioNumero.value = servicio.precioHoraPersona || 0;
  } else if (servicio.tipoAgenda === "mantenimiento") {
    precioNumero.value = servicio.precioDiagnostico || 0;
  } else if (servicio.tipoAgenda === "liberacion") {
    precioNumero.value = servicio.precioLiberacion || 0;
  }
}

async function guardarServicioEditado() {
  const servicios = window.ElCirculoData.getServicios();
  const id = document.getElementById("servicioId").value;
 const imagenFile = document.getElementById("servicioImagen")?.files[0];
let imagenUrl = "";

if (imagenFile) {
  imagenUrl = await subirArchivoSupabase(imagenFile, "imagenes-servicios");
}
  const serviciosActualizados = servicios.map((servicio) => {
    if (servicio.id !== id) return servicio;

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
        juegos: document.getElementById("servicioJuegos").value.split("\n").map((x) => x.trim()).filter(Boolean),
        equipos: document.getElementById("servicioEquipos").value.split("\n").map((x) => x.trim()).filter(Boolean),
        reglas: document.getElementById("servicioReglas").value.split("\n").map((x) => x.trim()).filter(Boolean),
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
}

/* CONTACTO */

function configurarContacto() {
  const formContacto = document.getElementById("formContacto");
  if (!formContacto) return;

  formContacto.addEventListener("submit", async (event) => {
    event.preventDefault();

    const contacto = {
      facebookTexto: document.getElementById("facebookTexto").value.trim(),
      facebookUrl: document.getElementById("facebookUrl").value.trim(),
      instagramTexto: document.getElementById("instagramTexto").value.trim(),
      instagramUrl: document.getElementById("instagramUrl").value.trim(),
      telefonoTexto: document.getElementById("telefonoTexto").value.trim(),
      telefonoUrl: document.getElementById("telefonoUrl").value.trim(),
      direccion: document.getElementById("direccionContacto").value.trim(),
      mapaUrl: document.getElementById("mapaUrl").value.trim(),
    };

    await window.ElCirculoData.guardarContacto(contacto);
    alert("Contacto guardado correctamente.");
  });
}

function cargarContacto() {
  const contacto = window.ElCirculoData.getContacto();

  if (!document.getElementById("formContacto")) return;

  document.getElementById("facebookTexto").value = contacto.facebookTexto || "";
  document.getElementById("facebookUrl").value = contacto.facebookUrl || "";
  document.getElementById("instagramTexto").value = contacto.instagramTexto || "";
  document.getElementById("instagramUrl").value = contacto.instagramUrl || "";
  document.getElementById("telefonoTexto").value = contacto.telefonoTexto || "";
  document.getElementById("telefonoUrl").value = contacto.telefonoUrl || "";
  document.getElementById("direccionContacto").value = contacto.direccion || "";
  document.getElementById("mapaUrl").value = contacto.mapaUrl || "";
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
      Number(item.id) === Number(id)
        ? { ...item, pregunta, respuesta }
        : item
    );

    await guardarFAQDatos(faqActualizado);
  } else {
    faq.push({
      id: Date.now(),
      pregunta,
      respuesta
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

  lista.innerHTML = faq.map((item) => `
    <article class="admin-event-item">
      <div>
        <h3>${item.pregunta}</h3>
        <p>${item.respuesta}</p>
      </div>

      <div class="admin-event-actions">
        <button onclick="editarFAQ(${item.id})">Editar</button>
        <button class="danger" onclick="eliminarFAQ(${item.id})">Eliminar</button>
      </div>
    </article>
  `).join("");
}

function editarFAQ(id) {
  const item = obtenerFAQ().find((faq) => Number(faq.id) === Number(id));
  if (!item) return;

  document.getElementById("faqId").value = item.id;
  document.getElementById("faqPregunta").value = item.pregunta;
  document.getElementById("faqRespuesta").value = item.respuesta;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function eliminarFAQ(id) {
  const confirmar = confirm("¿Seguro que deseas eliminar esta pregunta?");
  if (!confirmar) return;

  const faq = obtenerFAQ().filter((item) => Number(item.id) !== Number(id));
  await guardarFAQDatos(faq);

  renderizarFAQ();
}

function limpiarFormularioFAQ() {
  const formFAQ = document.getElementById("formFAQ");
  if (formFAQ) formFAQ.reset();

  const faqId = document.getElementById("faqId");
  if (faqId) faqId.value = "";
}