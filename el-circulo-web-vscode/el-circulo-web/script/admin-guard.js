const rolActivo = localStorage.getItem("rolActivo");

if (rolActivo !== "ADMIN") {
  alert("Acceso restringido. Debes iniciar sesión como administrador.");

  const estaEnPaginas = window.location.pathname.includes("/paginas/");

  if (estaEnPaginas) {
    window.location.href = "inicio.html";
  } else {
    window.location.href = "paginas/inicio.html";
  }
}