document.addEventListener("DOMContentLoaded", async () => {
  if (window.ElCirculoDataReady) {
    await window.ElCirculoDataReady;
  }

  renderizarPromociones();
});

function renderizarPromociones() {
  const promoList = document.getElementById("promoList");
  if (!promoList || !window.ElCirculoData) return;

  const promociones = window.ElCirculoData
    .getPromociones()
    .filter((promo) => promo.activa !== false);

  if (!promociones.length) {
    promoList.innerHTML = `
      <div class="promo-item">
        <h3>No hay promociones activas</h3>
        <p>Pronto tendremos nuevas promociones disponibles.</p>
      </div>
    `;
    return;
  }

  promoList.innerHTML = promociones
    .map((promo) => `
      <div class="promo-item">
        <h3>${promo.titulo}</h3>
        <p>${promo.descripcion}</p>
      </div>
    `)
    .join("");
}

function abrirPromociones() {
  const promoModal = document.getElementById("promoModal");
  if (promoModal) {
    renderizarPromociones();
    promoModal.classList.add("show");
    document.body.classList.add("modal-open");
  }
}

function cerrarPromociones() {
  const promoModal = document.getElementById("promoModal");
  if (promoModal) {
    promoModal.classList.remove("show");
    document.body.classList.remove("modal-open");
  }
}

window.abrirPromociones = abrirPromociones;
window.cerrarPromociones = cerrarPromociones;