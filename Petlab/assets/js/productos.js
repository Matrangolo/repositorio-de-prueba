const listaProductos = document.querySelector("#lista-productos");
const estadoProductos = document.querySelector("#estado-productos");
const campoBusqueda = document.querySelector("#busqueda");
const selectorCategoria = document.querySelector("#categoria");

let productos = [];

function mostrarProductos(productosParaMostrar) {
  listaProductos.innerHTML = "";

  if (productosParaMostrar.length === 0) {
    estadoProductos.textContent = "No encontramos productos con esos filtros.";
    return;
  }

  estadoProductos.textContent = "";

  productosParaMostrar.forEach((producto) => {
    const { nombre, descripcion, precio, categoria } = producto;

    const tarjeta = document.createElement("article");
    const tituloProducto = document.createElement("h3");
    const categoriaProducto = document.createElement("p");
    const descripcionProducto = document.createElement("p");
    const precioProducto = document.createElement("p");
    const botonAgregar = document.createElement("button");

    tituloProducto.textContent = nombre;
    categoriaProducto.textContent =
      categoria === "perros" ? "Para perros" : "Para gatos";
    descripcionProducto.textContent = descripcion;
    precioProducto.textContent = `$${precio}`;

    botonAgregar.textContent = "Agregar al carrito";
    botonAgregar.type = "button";
    botonAgregar.addEventListener("click", () => agregarAlCarrito(producto));

    tarjeta.appendChild(tituloProducto);
    tarjeta.appendChild(categoriaProducto);
    tarjeta.appendChild(descripcionProducto);
    tarjeta.appendChild(precioProducto);
    tarjeta.appendChild(botonAgregar);

    listaProductos.appendChild(tarjeta);
  });
}

function filtrarProductos() {
  const textoBuscado = campoBusqueda.value.trim().toLowerCase();
  const categoriaElegida = selectorCategoria.value;

  const productosFiltrados = productos.filter((producto) => {
    const coincideNombre = producto.nombre.toLowerCase().includes(textoBuscado);
    const coincideCategoria =
      categoriaElegida === "todos" || producto.categoria === categoriaElegida;

    return coincideNombre && coincideCategoria;
  });

  mostrarProductos(productosFiltrados);
}

async function cargarProductos() {
  estadoProductos.textContent = "Cargando productos...";

  try {
    const respuesta = await fetch("assets/data/productos.json");

    if (!respuesta.ok) {
      throw new Error("No se pudo cargar el archivo de productos.");
    }

    productos = await respuesta.json();
    filtrarProductos();
  } catch (error) {
    listaProductos.innerHTML = "";
    estadoProductos.textContent =
      "No pudimos cargar los productos. Intentá actualizar la página.";
  } finally {
    campoBusqueda.disabled = productos.length === 0;
    selectorCategoria.disabled = productos.length === 0;
  }
}

campoBusqueda.addEventListener("input", filtrarProductos);
selectorCategoria.addEventListener("change", filtrarProductos);

cargarProductos();