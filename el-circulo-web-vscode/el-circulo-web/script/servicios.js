let services = [];
let currentServiceIndex = 0;

const serviceGrid = document.getElementById("serviceGrid");
const servicePrev = document.getElementById("servicePrev");
const serviceNext = document.getElementById("serviceNext");
const serviceDots = document.getElementById("serviceDots");

function createList(items = []) {
  return items.map(item => `<li>${item}</li>`).join("");
}

function openServicePanel(service) {
  openModal(`
    <div class="service-expanded-panel">
      <div class="service-expanded-header">
        <div>
          <span class="service-tag">${service.tag}</span>
          <h2>${service.title}</h2>
        </div>
      </div>

      ${service.imagen ? `<img src="${service.imagen}" alt="${service.title}" class="service-expanded-image">` : ""}

      <div class="service-expanded-content">
        <section class="expanded-box service-info-box">
          <h3>Datos del servicio</h3>

          <div class="service-data">
            <article>
              <h4>¿Qué es?</h4>
              <p>${service.details.descripcion}</p>
            </article>

            <article>
              <h4>Precio</h4>
              <p>${service.details.precio}</p>
            </article>

            <article>
              <h4>Reglas del servicio</h4>
              <ul>${createList(service.details.reglas)}</ul>
            </article>
          </div>
        </section>

        <section class="expanded-box service-games-box">
          <h3>${service.details.tituloJuegos}</h3>
          <ul>${createList(service.details.juegos)}</ul>
        </section>

        <section class="expanded-box service-equipment-box">
          <h3>Equipos disponibles</h3>
          <ul>${createList(service.details.equipos)}</ul>
        </section>

        <div class="service-expanded-actions">
          <button type="button" class="btn btn-primary" id="serviceScheduleBtn">Agendar</button>
          <button type="button" class="btn btn-secondary" id="serviceCloseBtn">Volver</button>
        </div>
      </div>
    </div>
  `);

  document.getElementById("serviceCloseBtn")?.addEventListener("click", closeModal);

  document.getElementById("serviceScheduleBtn")?.addEventListener("click", () => {
    window.location.href = `agendar.html?servicio=${service.id}`;
  });
}

function getVisibleCards() {
  return 1;
}

function updateCarousel() {
  if (!serviceGrid || services.length === 0) return;

  const visibleCards = getVisibleCards();
  const maxIndex = Math.max(0, services.length - visibleCards);

  if (currentServiceIndex > maxIndex) {
    currentServiceIndex = maxIndex;
  }

  serviceGrid.style.transform = `translateX(-${currentServiceIndex * 100}%)`;
  updateDots();
}

function updateDots() {
  if (!serviceDots) return;

  serviceDots.innerHTML = "";

  services.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = "carousel-dot";

    if (index === currentServiceIndex) {
      dot.classList.add("active");
    }

    dot.addEventListener("click", () => {
      currentServiceIndex = index;
      updateCarousel();
    });

    serviceDots.appendChild(dot);
  });
}

function nextServiceSlide() {
  if (services.length === 0) return;

  currentServiceIndex++;

  if (currentServiceIndex >= services.length) {
    currentServiceIndex = 0;
  }

  updateCarousel();
}

function prevServiceSlide() {
  if (services.length === 0) return;

  currentServiceIndex--;

  if (currentServiceIndex < 0) {
    currentServiceIndex = services.length - 1;
  }

  updateCarousel();
}

function renderServices() {
  if (!serviceGrid) return;

  serviceGrid.innerHTML = "";

  services.forEach(service => {
    const card = document.createElement("article");
    card.className = `neon-card service-card ${service.type}`;

    card.innerHTML = `
      ${service.imagen ? `<img src="${service.imagen}" alt="${service.title}" class="service-card-image">` : ""}
      <span class="service-tag">${service.tag}</span>
      <h3>${service.title}</h3>
      <p>${service.short}</p>
      <div class="service-link">Más información →</div>
    `;

    card.addEventListener("click", () => {
      openServicePanel(service);
    });

    serviceGrid.appendChild(card);
  });

  updateCarousel();
}

function abrirServicioDesdeURL() {
  const params = new URLSearchParams(window.location.search);
  const servicioId = params.get("servicio");

  if (!servicioId) return;

  const servicio = services.find(item => item.id === servicioId);

  if (!servicio) return;

  setTimeout(() => {
    openServicePanel(servicio);
  }, 300);
}

async function iniciarServicios() {
  if (window.ElCirculoDataReady) {
    await window.ElCirculoDataReady;
  }

  if (!window.ElCirculoData) {
    console.error("No se encontró ElCirculoData. Revisa site-data.js");
    return;
  }

  services = window.ElCirculoData.getServicios();

  renderServices();
  abrirServicioDesdeURL();
}

serviceNext?.addEventListener("click", nextServiceSlide);
servicePrev?.addEventListener("click", prevServiceSlide);
window.addEventListener("resize", updateCarousel);

setInterval(nextServiceSlide, 6000);

iniciarServicios();