//definicion de constantes y variables

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

//array que va a contener los productos del json
const productos = [];

//traigo del json los productos
async function cargarProductos() {
    try {
        const response = await fetch('./productos.json');
        if (!response.ok) {
            throw new Error('Hubo un error en el servidor: ' + response.status);
        }
        const data = await response.json();
        productos.push(...data);
        mostrarCatalogo();
    } catch (error) {
        console.log('En este momento el servidor no puede procesar la información');
    }
}
cargarProductos();

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


//funciones relacionadas al catálogo de productos
//funcion para mostrar el catalogo
function mostrarCatalogo() {
    let seccionCatalogo = document.getElementById('idCatalogo');
    seccionCatalogo.innerHTML = '';
    productos.forEach((producto) => {  
        crearCatalogo(producto, seccionCatalogo);
    });
}


//creo tarjetas del catalogo
function crearCatalogo(producto, seccion) {
    let { nombre, precio, imagen } = producto;
    let card = document.createElement('div');
    card.classList.add('d-flex', 'justify-content-center', "cardCatalogo");

    let figure = document.createElement('figure');
    figure.classList.add('producto');
    figure.innerHTML = `<div class="imgprod"><img src="./img/${producto.imagen}"></div>
                        <div class="descripcionprod">
                            <figcaption><p class="titulocard">${producto.nombre} - ${producto.marca} </p></figcaption>
                            <p class="textoprecio">Precio: $${producto.precio.toLocaleString()} c/u</p>
                            <button class= "botonProductos btn btn-light" id="agregarcarrito-${producto.nombre}">+ Agregar al carrito</button>
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
                background: "#ebb4b4",
            },           
            }).showToast();
    };
}

//función para crear y configurar la tabla del carrito
function crearTablaCarrito() {
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

    thead.appendChild(tr);
    tabla.appendChild(thead);

    const tbody = document.createElement('tbody');
    tbody.classList.add('tablabody');
    tbody.setAttribute('id', 'tablaBody');
    tabla.appendChild(tbody);

    const tablaCarrito = document.getElementById('tablaCarrito');
    tablaCarrito.appendChild(tabla);
    tablaCarrito.style.display = 'none';

    const botonLimpiar = document.createElement('button');
    botonLimpiar.className = 'botonLimpiar btn btn-light';
    botonLimpiar.innerText = 'Limpiar todo';
    botonLimpiar.addEventListener('click', () => { limpiarCarrito() });

    const botonComprar = document.createElement('button');
    botonComprar.className = 'botonComprar btn btn-light';
    botonComprar.innerText = 'Realizar compra';
    botonComprar.addEventListener('click', () => { realizarCompra() });

    const contenedorBotones = document.createElement('div')
    contenedorBotones.classList.add('d-flex', 'justify-content-end');
    contenedorBotones.appendChild(botonLimpiar);
    contenedorBotones.appendChild(botonComprar);

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
}
crearTablaCarrito();

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
        botonResta.addEventListener('click', () => {
            restarProducto(producto) 
            Toastify({
                text: "¡Producto eliminado del carrito!",   
                gravity: 'bottom',        
                duration: 2000,
                style: {
                    background: "rgb(184, 95, 95)",
                },           
                }).showToast();
            });

        const botonSuma = document.getElementById(`sumar-${producto.nombre}`);
        botonSuma.addEventListener('click', () => { 
            agregarCarrito(producto) 
            Toastify({
                text: "¡Producto agregado al carrito!",   
                gravity: 'bottom',        
                duration: 2000,
                style: {
                    background: "#ebb4b4",
                },           
                }).showToast();
            });
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

//funcion para crear los filtros por categoria y marca
function crearFiltros() {
    //div filtro categoria
    const divFiltroCategoria = document.createElement('div');
    divFiltroCategoria.classList.add('divFiltroCategoria');
    
    const tituloCategoria = document.createElement('p');
    tituloCategoria.classList.add('titulofiltro');
    tituloCategoria.textContent = 'Categorías';
    divFiltroCategoria.appendChild(tituloCategoria);
    
    const selectCategoria = document.createElement('select');
    selectCategoria.id = 'filtroCategoria';
    selectCategoria.classList.add('form-select');
    
    const opcionesCategoria = ['todos', 'Maquillaje', 'Cuidado facial y corporal'];
    opcionesCategoria.forEach(opcion => {
        const option = document.createElement('option');
        option.value = opcion;
        option.textContent = opcion.charAt(0).toUpperCase() + opcion.slice(1);
        selectCategoria.appendChild(option);
    });
    divFiltroCategoria.appendChild(selectCategoria);
    
    //div filtro marca
    const divFiltroMarca = document.createElement('div');
    divFiltroMarca.classList.add('divFiltroMarca');
    
    const tituloMarca = document.createElement('p');
    tituloMarca.classList.add('titulofiltro');
    tituloMarca.textContent = 'Marcas';
    divFiltroMarca.appendChild(tituloMarca);
    
    const divFiltroMarcaCheckboxes = document.createElement('div');
    divFiltroMarcaCheckboxes.id = 'filtroMarca';
    divFiltroMarcaCheckboxes.classList.add('form-check', 'd-flex', 'flex-column');
    
    const marcas = ['Maybelline', 'Mac', 'CeraVe', 'Dove', 'Revlon'];
    marcas.forEach(marca => {
        const label = document.createElement('label');
        label.classList.add('form-check-label');
        
        const input = document.createElement('input');
        input.classList.add('form-check-input');
        input.type = 'checkbox';
        input.value = marca;
        
        label.appendChild(input);
        label.appendChild(document.createTextNode(' ' + marca));
        
        divFiltroMarcaCheckboxes.appendChild(label);
    });
    divFiltroMarca.appendChild(divFiltroMarcaCheckboxes);
    
    const seccionFiltro = document.querySelector('.seccionfiltro');
    seccionFiltro.appendChild(divFiltroCategoria);
    seccionFiltro.appendChild(divFiltroMarca);
}
crearFiltros();

//funcion para filtrar los productos
function filtrarProductos() {
    const filtroCategoria = document.getElementById('filtroCategoria').value;
    const checkboxesMarcas = document.querySelectorAll('#filtroMarca input[type="checkbox"]');
    const marcasSeleccionadas = [];

    checkboxesMarcas.forEach((checkbox) => {
        if (checkbox.checked) {
            marcasSeleccionadas.push(checkbox.value);
        }
    });

    let seccionCatalogo = document.getElementById('idCatalogo');
    seccionCatalogo.innerHTML = '';

    let hayCoincidencias = false;

    productos.forEach((producto) => {
        const cumpleFiltroCategoria = filtroCategoria === 'todos' || producto.categoria === filtroCategoria;
        const cumpleFiltroMarca = marcasSeleccionadas.includes(producto.marca) || marcasSeleccionadas.length === 0;

        if (cumpleFiltroCategoria && cumpleFiltroMarca) {
            crearCatalogo(producto, seccionCatalogo);
            hayCoincidencias = true;
        }
    });

    if (!hayCoincidencias) {
        const mensajeNoCoincidencias = document.createElement('div');
        mensajeNoCoincidencias.textContent = 'No hay productos que coincidan con los filtros seleccionados.';
        mensajeNoCoincidencias.classList.add('mensajeNoCoincidencias');
        seccionCatalogo.appendChild(mensajeNoCoincidencias);
    }
}
const selectFiltroCategoria = document.getElementById('filtroCategoria');
selectFiltroCategoria.addEventListener('change', filtrarProductos);
const selectFiltroMarca = document.getElementById('filtroMarca');
selectFiltroMarca.addEventListener('change', filtrarProductos);

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

//función para limpiar el carrito
function limpiarCarrito() {
    if (carrito.length === 0) {
        Swal.fire({
            title: "Carrito vacío",
            text: "No hay items en el carrito para limpiar.",
            icon: "warning",
            confirmButtonColor: "#ED9192",
            confirmButtonText: "Aceptar"
        });
    } else {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "¿Deseas limpiar todos los items del carrito?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, limpiar carrito",
            confirmButtonColor: "#ED9192",
            cancelButtonText: "Cancelar",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                carrito.splice(0, carrito.length);
                carritoAlStorage();
                mostrarCarrito();
                console.log("el usuario apretó confirmar para limpiar el carrito");
                Swal.fire({
                    title: "¡Carrito limpiado!",
                    text: "El carrito ha sido limpiado con éxito.",
                    icon: "success",
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#ED9192"
                });
            }
        });
    }
}

//función para simular la realización de la compra
function realizarCompra() {
    if (carrito.length === 0) {
        Swal.fire({
            title: "Carrito vacío",
            text: "No puede realizar la compra porque su carrito está vacío.",
            icon: "warning",
            confirmButtonColor: "#ED9192",
            confirmButtonText: "Aceptar"
        });
    } else {
        Swal.fire({
            title: "¡Ya casi está listo!",
            text: "¿Desea continuar con su compra?",
            showCancelButton: true,
            confirmButtonColor: "#ED9192",
            confirmButtonText: "Ir a pagar",
            cancelButtonText: "Aún no"
        }).then((result) => {
            if (result.isConfirmed) {
                carrito.splice(0, carrito.length);
                carrito = [];
                carritoAlStorage();
                mostrarCarrito();
                console.log("el usuario realizo una compra");
                Swal.fire({
                    title: "¡Compra realizada!",
                    text: "Su pago fue efectuado con éxito.",
                    icon: "success",
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#ED9192"
                });
            }
        });
    }
}

// inicialización
function inicializar() {
    mostrarCatalogo();
}    
inicializar();

