console.log("Página de inicio cargada correctamente.");

document.addEventListener("DOMContentLoaded", async () => {
  if (window.ElCirculoDataReady) {
    await window.ElCirculoDataReady;
  }

  renderizarCarruselEventosInicio();
});

function navegarConTransicion(url) {
  const scanTransition = document.getElementById("scanTransition");

  if (scanTransition) {
    scanTransition.classList.add("active");

    setTimeout(() => {
      window.location.href = url;
    }, 520);
  } else {
    window.location.href = url;
  }
}

function renderizarCarruselEventosInicio() {
  const carousel = document.getElementById("eventCarousel");
  const dotsContainer = document.getElementById("carouselDots");

  if (!carousel || !dotsContainer || !window.ElCirculoData) return;

  const eventos = window.ElCirculoData.getEventos();

  const eventosRecientes = [...eventos]
    .filter((evento) => evento.fecha)
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 5);

  const slidesEventos = eventosRecientes.map((evento) => {
    const banner = evento.banner || evento.imagen || "../img/slide1.png";

    return `
      <a 
        href="horarios.html?evento=${evento.id}"
        data-event-url="horarios.html?evento=${evento.id}"
        class="event-slide"
        style="background-image: linear-gradient(90deg, rgba(0,0,0,.78), rgba(0,0,0,.25)), url('${banner}');"
      >
        <span>${evento.estado || "Evento"}</span>
        <h3>${evento.titulo}</h3>
        <p>${evento.descripcion}</p>
      </a>
    `;
  });

  slidesEventos.push(`
    <a 
      href="horarios.html"
      data-event-url="horarios.html"
      class="event-slide more-events-slide"
    >
      <span>Calendario</span>
      <h3>Ver más eventos</h3>
      <p>Toca aquí para consultar todos nuestros horarios y actividades.</p>
    </a>
  `);

  carousel.innerHTML = slidesEventos.join("");
  dotsContainer.innerHTML = "";

  const slides = carousel.querySelectorAll(".event-slide");
  if (!slides.length) return;

  slides.forEach((slide) => {
    slide.addEventListener("click", (e) => {
      e.preventDefault();
      const url = slide.dataset.eventUrl || slide.getAttribute("href");
      navegarConTransicion(url);
    });
  });

  let currentSlide = 0;

  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.setAttribute("aria-label", `Ir al banner ${index + 1}`);

    dot.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      currentSlide = index;
      showSlide(currentSlide);
    });

    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll("button");

  function showSlide(index) {
    slides.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));

    slides[index].classList.add("active");
    dots[index].classList.add("active");
  }

  showSlide(currentSlide);

  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }, 4500);
}