//definicion de constantes y variables
//definicion de los productos del carrito
const productos = [
    { nombre: "Base", precio: 600, marca: "Maybelline", categoria: "Maquillaje", imagen: "basemayb.webp" },
    { nombre: "Rimel", precio: 800, marca: "Maybelline", categoria: "Maquillaje", imagen: "rimelmayb.jpg " },
    { nombre: "Delineador", precio: 1200, marca: "Mac", categoria: "Maquillaje", imagen: "delineadormac.jpg" },
    { nombre: "Contorno", precio: 650, marca: "Maybelline", categoria: "Maquillaje", imagen: "contornomayb.jpg" },
    { nombre: "Iluminador", precio: 650, marca: "Maybelline", categoria: "Maquillaje", imagen: "iluminadormayb.webp" },
    { nombre: "Crema facial día", precio: 900, marca: "CeraVe", categoria: "Cuidado facial y corporal", imagen: "cremadia.jpeg" },
    { nombre: "Crema de cuerpo", precio: 650, marca: "Dove", categoria: "Cuidado facial y corporal", imagen: "cremacuerpo.jpg" },
    { nombre: "Limpiador facial", precio: 750, marca: "CeraVe", categoria: "Cuidado facial y corporal", imagen: "limpadorfacial.jpg" },
    { nombre: "Gloss", precio: 700, marca: "Maybelline", categoria: "Maquillaje", imagen: "glossmayb.jpg" },
    { nombre: "Labial", precio: 750, marca: "Maybelline", categoria: "Maquillaje", imagen: "labialmayb.jpg" },
    { nombre: "Labial mate", precio: 790, marca: "Revlon", categoria: "Maquillaje", imagen: "labialrev.webp" },
    { nombre: "Polvo compácto", precio: 490, marca: "Revlon", categoria: "Maquillaje", imagen: "polvorev.webp" },

];

let nombreItem;
let nombreUsuario;
let precioItem;
let cantidad;
let total = 0;
let opcion;
let ticket = "";
let continuar;
let agregarProducto;
let carrito = [];

//funciones relacionadas al carrito y amacenamiento
function carritoAlStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}
function traerCarrito() {
    const carritoGuardado = localStorage.getItem("carrito");
    carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];
}

//carga inicial del carrito
carritoAlStorage();
traerCarrito();


//funciones relacionadas a la interfaz
//funcion para mostrar el catalogo
function mostrarCatalogo() {
    let seccionCatalogo = document.getElementById('idCatalogo');
    seccionCatalogo.innerHTML = '';
    productos.forEach((producto) => {
        tarjeta(producto, seccionCatalogo);
    });
}

//creo tarjetas del catalogo
function tarjeta(producto, seccion) {
    let { nombre, precio, imagen } = producto;
    let card = document.createElement('div');
    card.classList.add('d-flex', 'justify-content-center', "cardCatalogo");

    let figure = document.createElement('figure');
    figure.classList.add('producto');
    figure.innerHTML = `<div class="imgprod"><img src="./img/${producto.imagen}"></div>
                        <div class="descripcionprod">
                            <figcaption><p class="titulocard">${producto.nombre} - ${producto.marca} </p></figcaption>
                            <p class="textoprecio">precio: $${producto.precio.toLocaleString()} c/u</p>
                            <button class= "botonProductos btn btn-light" id="agregarcarrito-${producto.nombre}">Agregar al carrito</button>
                        </div>`;
    card.appendChild(figure);
    seccion.appendChild(card);
    const botonAgregar = document.getElementById(`agregarcarrito-${nombre}`);
    botonAgregar.onclick = () => { 
        agregarCarrito(producto) 
        Toastify({
            text: "¡Producto agregado al carrito!",   
            gravity: 'bottom',        
            duration: 2000,
            style: {
                background: "#c98e8e",
            },           
            }).showToast();
    };
}

//creo tabla
const tabla = document.createElement('table');
tabla.classList.add('table', 'table-light');

const thead = document.createElement('thead');
const tr = document.createElement('tr');

const thProducto = document.createElement('th');
thProducto.classList.add('headTabla', 'productosCol');
thProducto.setAttribute('scope', 'col');
thProducto.textContent = 'Producto';
tr.appendChild(thProducto);

const thCantidad = document.createElement('th');
thCantidad.classList.add('headTabla', 'cantidadCol');
thCantidad.setAttribute('scope', 'col');
thCantidad.textContent = 'Cantidad';
tr.appendChild(thCantidad);

const thSubtotal = document.createElement('th');
thSubtotal.classList.add('headTabla', 'subtotalCol');
thSubtotal.setAttribute('scope', 'col');
thSubtotal.textContent = 'Subtotal';
tr.appendChild(thSubtotal);

thead.appendChild(tr);
tabla.appendChild(thead);

const tbody = document.createElement('tbody');
tbody.classList.add('tablabody');
tbody.setAttribute('id', 'tablaBody');
tabla.appendChild(tbody);

//agrego tabla a mi section en html
const tablaCarrito = document.getElementById('tablaCarrito');
tablaCarrito.appendChild(tabla);
tablaCarrito.style.display = 'none';

//creo botones de limpiar y comprar
const botonLimpiar = document.createElement('button');
botonLimpiar.className = 'botonLimpiar btn btn-light';
botonLimpiar.innerText = 'Limpiar todo';
botonLimpiar.addEventListener('click', () => { limpiarCarrito() });

const botonComprar = document.createElement('button');
botonComprar.className = 'botonComprar btn btn-light';
botonComprar.innerText = 'Realizar compra';
botonComprar.addEventListener('click', () => { realizarCompra() });

//agrego botones al contenedor
const contenedorBotones = document.createElement('div')
contenedorBotones.classList.add('d-flex', 'justify-content-end');
contenedorBotones.appendChild(botonLimpiar);
contenedorBotones.appendChild(botonComprar);

//agrego el contenedor al final de la tablaCarrito
tablaCarrito.appendChild(contenedorBotones);

const botonVerCarrito = document.getElementById('botonVerCarrito');
const rect = botonVerCarrito.getBoundingClientRect();
tablaCarrito.style.top = rect.bottom + 'px';
tablaCarrito.style.left = rect.left + 'px';
botonVerCarrito.addEventListener('click', () => {
    if (tablaCarrito.style.display === 'none') {
        tablaCarrito.style.display = 'block';
        tablaCarrito.style.top = rect.bottom + 'px';
        tablaCarrito.style.left = rect.right - tablaCarrito.offsetWidth + 'px';
        mostrarCarrito();
    } else {
        tablaCarrito.style.display = 'none';
    }
});

//funcion para mostrar el contenido del carrito
function mostrarCarrito() {
    let tablaBody = document.getElementById('tablaBody');
    tablaBody.innerHTML = '';

    carrito.forEach((producto) => {
        const fila = document.createElement('tr');
        fila.classList.add('itemTicket');

        let dato = document.createElement('td');
        dato.innerHTML = `
            <div class="itemEnTabla">
                <p class="nombreEnTabla">${producto.nombre}</p>
            </div>
        `;
        fila.appendChild(dato);

        dato = document.createElement('td');
        dato.classList.add('tdCantidad');
        dato.innerHTML = `
            <div class="celdaCantidad">
                <button class= "botonRestar btn btn-light" id="restar-${producto.nombre}">-</button>
                <p class="cantidadTicket">${producto.cantidad}</p>
                <button class= "botonSumar btn btn-light" id="sumar-${producto.nombre}">+</button>
            </div>
        `;
        fila.appendChild(dato);

        dato = document.createElement('td');
        dato.classList.add('precioColumna');
        dato.textContent = `$ ${(producto.precio * producto.cantidad).toLocaleString()}`;
        fila.appendChild(dato);

        tablaBody.appendChild(fila);

        const botonResta = document.getElementById(`restar-${producto.nombre}`);
        botonResta.addEventListener('click', () => { restarProducto(producto) });

        const botonSuma = document.getElementById(`sumar-${producto.nombre}`);
        botonSuma.addEventListener('click', () => { agregarCarrito(producto) });
    });

    const filaTotal = document.createElement('tr');
    filaTotal.classList.add('itemTicket', 'filaTotal');

    const thTotal = document.createElement('th');
    thTotal.colSpan = 2;
    thTotal.classList.add('totalTexto');
    thTotal.textContent = 'Total:';
    filaTotal.appendChild(thTotal);

    const tdTotal = document.createElement('td');
    tdTotal.classList.add('precioColumna');
    tdTotal.innerHTML = `$ ${(calcularTotalCarrito()).toLocaleString()}`;
    filaTotal.appendChild(tdTotal);

    tablaBody.appendChild(filaTotal);
}

//funcion para filtrar los productos por marca
function filtrarPorMarca() {
    const filtroMarca = document.getElementById('filtroMarca').value;

    let seccionCatalogo = document.getElementById('idCatalogo');
    seccionCatalogo.innerHTML = '';

    productos.forEach((producto) => {
        if (filtroMarca === 'todos' || producto.marca === filtroMarca) {
            tarjeta(producto, seccionCatalogo);
        }
    });
}

const selectFiltroMarca = document.getElementById('filtroMarca');
selectFiltroMarca.addEventListener('change', filtrarPorMarca);

//funcion para agregar productos al carrito
function agregarCarrito(eleccion) {
        let productoEnCarrito = carrito.find((producto) => producto.nombre === eleccion.nombre);
        if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
        } else {
        let nuevoItem = { ...eleccion, cantidad: 1 };
        carrito.push(nuevoItem);
        }
        carritoAlStorage();
        mostrarCarrito();
    }

//funcion para restar productos del carrito    
function restarProducto(eleccion) {
    let productoEnCarrito = carrito.find((producto) => producto.nombre === eleccion.nombre);
    if (productoEnCarrito) {
        if (productoEnCarrito.cantidad === 1) {
            carrito = carrito.filter((producto) => producto.nombre !== eleccion.nombre);
            } else {
            productoEnCarrito.cantidad--;
        }
        carritoAlStorage();
        mostrarCarrito();
    }
}
    
//funcion para calcular el total del carrito
function calcularTotalCarrito() {
        return carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
}

//funcion para limpiar el carrito
function limpiarCarrito() {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas limpiar todos los items del carrito?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, limpiar carrito',
            confirmButtonColor: '#ED9192',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                carrito.splice(0, carrito.length);
                carrito = [];
                carritoAlStorage();
                mostrarCarrito();
                console.log("el usuario apreto confirmar para limpiar el carrito")
                Swal.fire({
                    title: '¡Carrito limpiado!',
                    text: 'El carrito ha sido limpiado con éxito.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#ED9192',
                });
                }
            });
}

//función para simular la realizacion de la compra
function realizarCompra() {
        Swal.fire({
        title: "¡Ya casi está listo!",
        text: '¿Desea continuar con su compra?',
        showCancelButton: true,
        confirmButtonColor: '#ED9192',
        confirmButtonText: 'Ir a pagar',
        cancelButtonText: 'Aún no',
        }).then((result) => {
            if (result.isConfirmed) {
                carrito.splice(0, carrito.length);
                carrito = [];
                carritoAlStorage();
                mostrarCarrito();
                console.log("el usuario realizo una compra")
                Swal.fire({
                    title: '¡Compra realizada!',
                    text: 'Su pago fue efectuado con éxito.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#ED9192',
                });
            }
        });
}
    
// inicialización
function inicializar() {
    mostrarCatalogo();
}    
inicializar();
