document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menuToggle");
  const menuPanel = document.getElementById("menuPanel");
  const menuLinks = document.querySelectorAll(".menu-panel a");

  if (!menuToggle || !menuPanel) {
    return;
  }

  function abrirMenu() {
    menuToggle.classList.add("open");
    menuPanel.classList.add("show");
  }

  function cerrarMenu() {
    menuToggle.classList.remove("open");
    menuPanel.classList.remove("show");
  }

  function alternarMenu() {
    if (menuPanel.classList.contains("show")) {
      cerrarMenu();
    } else {
      abrirMenu();
    }
  }

  menuToggle.addEventListener("click", function (event) {
    event.stopPropagation();
    alternarMenu();
  });

  menuPanel.addEventListener("click", function (event) {
    event.stopPropagation();
  });

  document.addEventListener("click", function () {
    cerrarMenu();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      cerrarMenu();
    }
  });

  const paginaActual = window.location.pathname.split("/").pop();

  menuLinks.forEach(function (link) {
    const paginaLink = link.getAttribute("href");

    if (paginaActual === paginaLink) {
      link.classList.add("active-page");
    }

    link.addEventListener("click", function () {
      cerrarMenu();
    });
  });
});