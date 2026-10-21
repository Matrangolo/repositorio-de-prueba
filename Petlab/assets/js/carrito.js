const listaCarrito = document.querySelector("#lista-carrito");
const totalCarrito = document.querySelector("#total-carrito");
const botonVaciarCarrito = document.querySelector("#vaciar-carrito");
const formularioPedido = document.querySelector("#formulario-pedido");
const historialPedidos = document.querySelector("#historial-pedidos");
const botonVaciarHistorial = document.querySelector("#vaciar-historial");
const campoNombre = document.querySelector("#nombre-cliente");
const campoDireccion = document.querySelector("#direccion-cliente");

let carrito = JSON.parse(localStorage.getItem("petlab-carrito")) || [];
let pedidos = JSON.parse(localStorage.getItem("petlab-pedidos")) || [];

function calcularTotal() {
  return carrito.reduce(
    (acumulado, producto) => acumulado + producto.precio * producto.cantidad,
    0
  );
}

function guardarCarrito() {
  if (carrito.length === 0) {
    localStorage.removeItem("petlab-carrito");
  } else {
    localStorage.setItem("petlab-carrito", JSON.stringify(carrito));
  }

  mostrarCarrito();
}

function mostrarCarrito() {
  listaCarrito.innerHTML = "";

  if (carrito.length === 0) {
    const mensaje = document.createElement("p");
    mensaje.textContent = "Tu carrito está vacío.";
    listaCarrito.appendChild(mensaje);
  }

  carrito.forEach((producto) => {
    const detalle = document.createElement("div");
    const descripcion = document.createElement("p");
    const botonRestar = document.createElement("button");
    const botonSumar = document.createElement("button");
    const botonQuitar = document.createElement("button");

    descripcion.textContent =
      `${producto.nombre} × ${producto.cantidad} — ` +
      `$${producto.precio * producto.cantidad}`;

    botonRestar.textContent = "−";
    botonRestar.type = "button";
    botonRestar.addEventListener("click", () => cambiarCantidad(producto.id, -1));

    botonSumar.textContent = "+";
    botonSumar.type = "button";
    botonSumar.addEventListener("click", () => cambiarCantidad(producto.id, 1));

    botonQuitar.textContent = "Quitar";
    botonQuitar.type = "button";
    botonQuitar.addEventListener("click", () => quitarProducto(producto.id));

    detalle.appendChild(descripcion);
    detalle.appendChild(botonRestar);
    detalle.appendChild(botonSumar);
    detalle.appendChild(botonQuitar);
    listaCarrito.appendChild(detalle);
  });

  totalCarrito.textContent = `$${calcularTotal()}`;
  botonVaciarCarrito.disabled = carrito.length === 0;
}

function agregarAlCarrito(producto) {
  const productoExistente = carrito.find(
    (productoEnCarrito) => productoEnCarrito.id === producto.id
  );

  if (productoExistente) {
    productoExistente.cantidad += 1;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1
    });
  }

  guardarCarrito();
}

function cambiarCantidad(idProducto, cambio) {
  const producto = carrito.find(
    (productoEnCarrito) => productoEnCarrito.id === idProducto
  );

  if (!producto) {
    return;
  }

  producto.cantidad += cambio;

  if (producto.cantidad <= 0) {
    quitarProducto(idProducto);
    return;
  }

  guardarCarrito();
}

function quitarProducto(idProducto) {
  carrito = carrito.filter((producto) => producto.id !== idProducto);
  guardarCarrito();
}

function mostrarPedidos() {
  historialPedidos.innerHTML = "";

  if (pedidos.length === 0) {
    const mensaje = document.createElement("p");
    mensaje.textContent = "Todavía no hay pedidos.";
    historialPedidos.appendChild(mensaje);
  }

  pedidos.forEach((pedido) => {
    const detalle = document.createElement("p");

    detalle.textContent =
      `Pedido #${pedido.numero} — ${pedido.nombre} — $${pedido.total}`;

    historialPedidos.appendChild(detalle);
  });

  botonVaciarHistorial.disabled = pedidos.length === 0;
}

formularioPedido.addEventListener("submit", (evento) => {
  evento.preventDefault();

  if (carrito.length === 0) {
    Swal.fire("Carrito vacío", "Agregá un producto antes de confirmar.", "warning");
    return;
  }

  const nombre = campoNombre.value.trim();
  const direccion = campoDireccion.value.trim();

  if (!nombre || !direccion) {
    Swal.fire("Faltan datos", "Completá tu nombre y dirección.", "warning");
    return;
  }

  const pedido = {
    numero: pedidos.length + 1,
    nombre,
    direccion,
    productos: carrito.map((producto) => ({ ...producto })),
    total: calcularTotal()
  };

  pedidos.push(pedido);
  localStorage.setItem("petlab-pedidos", JSON.stringify(pedidos));

  carrito = [];
  guardarCarrito();
  mostrarPedidos();

  campoNombre.value = "";
  campoDireccion.value = "";

  Swal.fire(
    "¡Pedido confirmado!",
    `Pedido #${pedido.numero} por $${pedido.total}.`,
    "success"
  );
});

botonVaciarCarrito.addEventListener("click", () => {
  carrito = [];
  guardarCarrito();
});

botonVaciarHistorial.addEventListener("click", async () => {
  const respuesta = await Swal.fire({
    title: "¿Borrar todos los pedidos?",
    text: "Se eliminará el historial guardado en este navegador.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, borrar",
    cancelButtonText: "Cancelar"
  });

  if (respuesta.isConfirmed) {
    pedidos = [];
    localStorage.removeItem("petlab-pedidos");
    mostrarPedidos();
  }
});

mostrarCarrito();
mostrarPedidos();