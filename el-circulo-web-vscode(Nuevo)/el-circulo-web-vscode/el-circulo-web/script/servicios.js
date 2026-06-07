const services = window.ElCirculoData.getServicios();
const serviceGrid = document.getElementById("serviceGrid");

function createList(items = []) {
  return items.map((item) => `<li>${item}</li>`).join("");
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

  const closeBtn = document.getElementById("serviceCloseBtn");
  const scheduleBtn = document.getElementById("serviceScheduleBtn");

  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  if (scheduleBtn) {
    scheduleBtn.addEventListener("click", () => {
      window.location.href = `agendar.html?servicio=${service.id}`;
    });
  }
}

function renderServices() {
  if (!serviceGrid) return;

  serviceGrid.innerHTML = "";

  services.forEach((service) => {
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
}

renderServices();

/* Imágenes laterales */
const randomServiceImages = [
  "../img/slide1.png",
  "../img/slide2.png",
  "../img/slide3.png",
  "../img/slide4.png",
  "../img/slide5.png",
  "../img/slide6.png",
  "../img/slide7.png",
  "../img/slide8.png",
  "../img/slide9.png",
  "../img/slide10.png",
];

const leftRandomImage = document.getElementById("leftRandomImage");
const rightRandomImage = document.getElementById("rightRandomImage");

function getRandomTime() {
  return Math.floor(Math.random() * 5001) + 5000;
}

function getRandomImage(currentSrc) {
  let newImage = currentSrc;

  while (newImage === currentSrc) {
    const randomIndex = Math.floor(Math.random() * randomServiceImages.length);
    newImage = randomServiceImages[randomIndex];
  }

  return newImage;
}

function changeSideImage(imageElement) {
  if (!imageElement) return;

  const imageBox = imageElement.closest(".side-image-box");
  const currentImage = imageElement.getAttribute("src");
  const nextImage = getRandomImage(currentImage);

  if (!imageBox) return;

  imageBox.classList.add("changing");

  setTimeout(() => {
    imageElement.setAttribute("src", nextImage);
  }, 360);

  setTimeout(() => {
    imageBox.classList.remove("changing");
  }, 850);
}

function startRandomImageLoop(imageElement) {
  if (!imageElement) return;

  function loop() {
    const randomTime = getRandomTime();

    setTimeout(() => {
      changeSideImage(imageElement);
      loop();
    }, randomTime);
  }

  loop();
}

startRandomImageLoop(leftRandomImage);
startRandomImageLoop(rightRandomImage);

function abrirServicioDesdeURL() {
  const params = new URLSearchParams(window.location.search);
  const servicioId = params.get("servicio");

  if (!servicioId) return;

  const servicio = services.find((item) => item.id === servicioId);

  if (!servicio) return;

  setTimeout(() => {
    openServicePanel(servicio);
  }, 300);
}

abrirServicioDesdeURL();