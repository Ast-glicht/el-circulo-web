const gallery = [
  {
    title: "Zona PS5",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=1200&q=80",
    description: "Espacio moderno para partidas intensas y sesiones largas.",
  },
  {
    title: "Estación Nintendo",
    image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=1200&q=80",
    description: "Una zona ideal para diversión casual y multijugador.",
  },
  {
    title: "Setup Gamer",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
    description: "Ambientación gamer con luces, comodidad y estilo.",
  },
  {
    title: "Comunidad",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80",
    description: "Un lugar para compartir, competir y pasarla bien.",
  },
];

const galleryGrid = document.getElementById("galleryGrid");

function renderGallery() {
  if (!galleryGrid) return;

  gallery.forEach((item) => {
    const figure = document.createElement("figure");

    figure.className = "gallery-card";

    figure.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <figcaption>
        <strong>${item.title}</strong>
        <p>${item.description}</p>
      </figcaption>
    `;

    figure.addEventListener("click", () => {
      openModal(`
        <img src="${item.image}" alt="${item.title}">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      `);
    });

    galleryGrid.appendChild(figure);
  });
}

renderGallery();