const rolActivo = localStorage.getItem("rolActivo");

if (rolActivo !== "ADMIN") {
  alert("Acceso restringido. Debes iniciar sesión como administrador.");
  window.location.href = "inicio.html";
}