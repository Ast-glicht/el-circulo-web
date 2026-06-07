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

  renderizarEventos();
  cargarHorarios();
  cargarPromo();
  cargarSelectServicios();
  cargarContacto();
});

function configurarCerrarSesion() {
  const btnCerrar = document.getElementById("cerrarSesionAdmin");

  if (!btnCerrar) return;

  btnCerrar.addEventListener("click", () => {

    window.location.href = "inicio.html";
  });
}

function configurarSeccionesPanel() {
  const tarjetas = document.querySelectorAll(".admin-dashboard-card");
  const secciones = document.querySelectorAll(".admin-section");

  tarjetas.forEach((tarjeta) => {
    tarjeta.addEventListener("click", () => {
      const seccionActiva = tarjeta.dataset.adminSection;

      tarjetas.forEach((item) => item.classList.remove("active"));
      tarjeta.classList.add("active");

      secciones.forEach((seccion) => seccion.classList.remove("active"));

      const section = document.getElementById(`section-${seccionActiva}`);
      if (section) section.classList.add("active");
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

  if (!titulo || !fecha || !hora || !descripcion) {
    alert("Completa todos los datos del evento.");
    return;
  }

  try {
    const eventos = obtenerEventos();
    const imagenBase64 = await window.ElCirculoData.convertirArchivoABase64(imagenFile);

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
            imagen: imagenBase64 || evento.imagen || "",
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
        imagen: imagenBase64 || "",
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

/* PROMOS */

function configurarPromos() {
  const formPromo = document.getElementById("formPromo");
  if (!formPromo) return;

  formPromo.addEventListener("submit", async (event) => {
    event.preventDefault();

    const promo = document.getElementById("promoTexto").value.trim();
    await window.ElCirculoData.guardarPromo(promo);

    alert("Promoción guardada correctamente.");
  });
}

function cargarPromo() {
  const promo = window.ElCirculoData.getPromo();
  const inputPromo = document.getElementById("promoTexto");

  if (inputPromo) inputPromo.value = promo || "";
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
  const imagenBase64 = await window.ElCirculoData.convertirArchivoABase64(imagenFile);

  const serviciosActualizados = servicios.map((servicio) => {
    if (servicio.id !== id) return servicio;

    const precioNumero = Number(document.getElementById("servicioPrecioNumero").value || 0);

    const actualizado = {
      ...servicio,
      title: document.getElementById("servicioTitulo").value.trim(),
      tag: document.getElementById("servicioTag").value.trim(),
      short: document.getElementById("servicioShort").value.trim(),
      imagen: imagenBase64 || servicio.imagen || "",
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