const productos = [
    { nombre: "Base", precio: 600, marca: "Maybelline", imagen: "basemayb.webp" },
    { nombre: "Rimel", precio: 800, marca: "Maybelline", imagen: "rimelmayb.jpeg " },
    { nombre: "Delineador", precio: 1200, marca: "Mac", imagen: "delineadormac.jfif" },
    { nombre: "Contorno", precio: 650, marca: "Maybelline", imagen: "contornomayb.jpg" },
    { nombre: "Iluminador", precio: 650, marca: "Maybelline", imagen: "iluminadormayb.webp" },
    { nombre: "Crema facial día", precio: 900, marca: "CeraVe", imagen: "cremadia.jpg" },
    { nombre: "Crema de cuerpo", precio: 650, marca: "Dove", imagen: "cremacuerpo.jpg" },
    { nombre: "Limpiador facial", precio: 750, marca: "CeraVe", imagen: "limpadorfacial.jpg" },
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

// guardo el carrito en el localStorage
function carritoAlStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// traer el carrito del localStorage
function traerCarrito() {
    const carritoGuardado = localStorage.getItem("carrito");
    carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];
}

// guardar el carrito en el localStorage
carritoAlStorage();

// traer el carrito del localStorage
traerCarrito();

// creo tabla
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
tbody.setAttribute('id', 'tablaBody');
tabla.appendChild(tbody);

// agrego tabla a mi section en html
const tablaCarrito = document.getElementById('tablaCarrito');
tablaCarrito.appendChild(tabla);

// catalogo y cards

function mostrarCatalogo() {
    let seccionCatalogo = document.getElementById('idCatalogo');
    seccionCatalogo.innerHTML = '';
    productos.forEach((producto) => {
        tarjeta(producto, seccionCatalogo);
    });
}

function tarjeta(producto, seccion) {
    let { nombre, precio, imagen } = producto;
    let card = document.createElement('div');
    card.classList.add('d-flex', 'justify-content-center', "cardCatalogo");

    let figure = document.createElement('figure');
    figure.classList.add('producto');
    figure.innerHTML = `<div class="imgprod"><img src="./img/${producto.imagen}"></div>
                        <div class="descripcionprod">
                            <figcaption><p>${producto.nombre} - ${producto.marca} </p></figcaption>
                            <p>precio: $${producto.precio.toLocaleString()}</p>
                            <button class= "btn btn-light" id="agregarcarrito-${producto.nombre}">+ Añadir al carrito</button>
                        </div>`;
    card.appendChild(figure);
    seccion.appendChild(card);
    const botonAgregar = document.getElementById(`agregarcarrito-${nombre}`);
    botonAgregar.onclick = () => { 
        agregarCarrito(producto) 
        Toastify({
            text: "¡Producto agregado al carrito!",           
            duration: 2000,
            style: {
                background: "linear-gradient(to right, #FFB5B6, #DE8789)",
            },           
            }).showToast();
    };
}

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
                <button class= "btn btn-light" id="restar-${producto.nombre}">-</button>
                <p class="cantidadTicket">${producto.cantidad}</p>
                <button class= "btn btn-light" id="sumar-${producto.nombre}">+</button>
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

    const botonLimpiar = document.createElement('button');
    botonLimpiar.className = 'limpiar Carrito btn btn-light';
    botonLimpiar.innerText = 'Limpiar todo';
    tablaBody.appendChild(botonLimpiar);
    botonLimpiar.addEventListener('click', () => { limpiarCarrito() });
}

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

    function restarProducto(eleccion){
        let indice = carrito.findIndex((el) => el.id === eleccion.id);
        if (carrito[indice].cantidad == 1){
            carrito.splice([indice],1);
        }else{
            carrito[indice].cantidad--;
        }
        carritoAlStorage();
        mostrarCarrito();
    }

    function calcularTotalCarrito() {
        return carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
    }

    function limpiarCarrito() {
        Swal.fire({
            //title: '¿Estás seguro?',
            text: '¿Deseas limpiar todos los items del carrito?',
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
    
mostrarCatalogo();










/*        carrito.splice(0, carrito.length);
carrito = [];
carritoAlStorage();
mostrarCarrito();/*/

///loggeo para que el ususario se loggee

/*const BOTONLOGIN = document.getElementById("otroBoton");
const USUARIO = 

BOTONLOGIN.addEventListener('click', () => {
    Swal.fire({
        title: "Login de usuario",
        text: "Bienvenido al login de Pepes Page",
        inputLabel: "Ingrese su nombre de usuario",
        inputPlaceholder: "pepe@pepe.com", // Corrección aquí: inputPlaceholder en lugar de inputPlaceHolder
        input: "email",
        confirmButtonText: "Enviar",
        showCancelButton: true,
        cancelButtonText: "cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            const usuario = result.value;
            // Aquí puedes realizar las acciones con el nombre de usuario ingresado, por ejemplo, enviarlo al servidor para autenticación.
            // También puedes utilizar SweetAlert para mostrar mensajes de éxito o error en caso de que el login sea exitoso o falle.
        }
    });
});
*/