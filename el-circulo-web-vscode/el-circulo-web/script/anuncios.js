const anuncios = [
  {
    titulo: "Nuevos eventos disponibles",
    fecha: "2026-06-12",
    categoria: "Eventos",
    descripcion:
      "Muy pronto tendremos nuevos torneos, noches gamer y dinámicas especiales para nuestra comunidad.",
    destacado: true
  },
  {
    titulo: "Promociones próximamente",
    fecha: "2026-06-12",
    categoria: "Promociones",
    descripcion:
      "Estamos preparando promociones especiales para horas de juego en PS4, PS5 y Nintendo Switch.",
    destacado: false
  },
  {
    titulo: "Actualización de horarios",
    fecha: "2026-06-12",
    categoria: "Horarios",
    descripcion:
      "Los horarios de atención y eventos serán publicados en la sección de horarios para que podás revisarlos fácilmente.",
    destacado: false
  }
];

const anunciosGrid = document.getElementById("anunciosGrid");

function cargarAnuncios() {
  if (!anunciosGrid) return;

  anunciosGrid.innerHTML = "";

  if (anuncios.length === 0) {
    anunciosGrid.innerHTML = `
      <article class="anuncio-card anuncio-empty">
        <span class="anuncio-tag">Próximamente</span>
        <h3>No hay anuncios disponibles</h3>
        <p>Volvé pronto para ver nuevas noticias de El Círculo Gaming House.</p>
      </article>
    `;
    return;
  }

  anuncios.forEach(anuncio => {
    const card = document.createElement("article");
    card.className = anuncio.destacado
      ? "anuncio-card anuncio-destacado"
      : "anuncio-card";

    card.innerHTML = `
      <span class="anuncio-tag">${anuncio.categoria}</span>
      <h3>${anuncio.titulo}</h3>
      <p>${anuncio.descripcion}</p>
      <small>${formatearFecha(anuncio.fecha)}</small>
    `;

    anunciosGrid.appendChild(card);
  });
}

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString("es-NI", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

cargarAnuncios();