const gallery = [
  {
    title: "Ambiente de VR",
    type: "video",
    src: "../videos/video1.mp4",
    poster: "../img/galeria/video1.jpg",
    description: "La energía, emoción y ambiente que se vive durante nuestros eventos.",
    featured: true,
  },
  {
    title: "Torneo Presencial",
    type: "image",
    src: "../img/galeria/foto1.jpeg",
    description: "Jugadores reunidos disfrutando de una jornada llena de competencia y diversión.",
  },
  {
    title: "Experiencia El Círculo",
    type: "video",
    src: "../videos/video2.mp4",
    poster: "../img/galeria/video2.jpg",
    description: "Un recorrido por la comunidad gamer que hace único a El Círculo.",
    featured: true,
  },
  {
    title: "Evento Comunitario",
    type: "image",
    src: "../img/galeria/foto2.jpeg",
    description: "La comunidad gamer compartiendo experiencias dentro de El Círculo.",
  },
  {
    title: "Entrada Oficial",
    type: "image",
    src: "../img/galeria/foto3.jpeg",
    description: "Acceso principal a El Círculo Gaming House durante actividades y eventos.",
  },
  {
    title: "Zona Nintendo",
    type: "image",
    src: "../img/galeria/foto4.jpeg",
    description: "Partidas multijugador que reúnen a jugadores de todas las edades.",
  },
  {
    title: "Competencia Gamer",
    type: "image",
    src: "../img/galeria/foto5.jpeg",
    description: "Participantes concentrados compitiendo en un emocionante torneo.",
  },
  {
    title: "Evento Especial",
    type: "image",
    src: "../img/galeria/foto6.jpeg",
    description: "Asistentes disfrutando de actividades, videojuegos y convivencia.",
  },
  {
    title: "Zona PlayStation",
    type: "image",
    src: "../img/galeria/foto7.jpeg",
    description: "Espacio dedicado a partidas competitivas y encuentros entre amigos.",
  },
  {
    title: "Final de Torneo",
    type: "image",
    src: "../img/galeria/foto8.jpeg",
    description: "Jugadores y espectadores siguiendo de cerca cada enfrentamiento.",
  },
];

const galleryGrid = document.getElementById("galleryGrid");

function renderGallery() {
  if (!galleryGrid) return;

  galleryGrid.innerHTML = "";

  gallery.forEach((item, index) => {
    const card = document.createElement("article");

    card.className = `gallery-neon-card ${item.featured ? "featured" : ""}`;
    card.style.animationDelay = `${index * 0.07}s`;

   const mediaContent =
  item.type === "video"
    ? `
      <video
        muted
        autoplay
        loop
        playsinline
        preload="auto"
        poster="${item.poster}"
        class="gallery-preview-video"
      >
        <source src="${item.src}" type="video/mp4">
        Tu navegador no soporta videos.
      </video>

      <div class="play-badge">
        <i class="fa-solid fa-play"></i>
      </div>
    `
    : `<img src="${item.src}" alt="${item.title}">`;

    card.innerHTML = `
      <div class="gallery-media">
        ${mediaContent}
      </div>

      <div class="gallery-overlay">
        <span>${item.type === "video" ? "Video" : "Imagen"}</span>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      </div>
    `;



    card.addEventListener("click", () => {
      if (item.type === "video") {
        openModal(`
          <video controls autoplay playsinline class="modal-gallery-video" poster="${item.poster}">
            <source src="${item.src}" type="video/mp4">
            Tu navegador no soporta videos.
          </video>
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        `);
      } else {
        openModal(`
          <img src="${item.src}" alt="${item.title}" class="modal-gallery-img">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        `);
      }
    });

    galleryGrid.appendChild(card);
  });
}

renderGallery();