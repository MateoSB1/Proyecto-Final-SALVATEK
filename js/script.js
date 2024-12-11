// Lista de productos
const productos = [
    { id: 1, nombre: 'GEFORCE RTX 4060 TI 8GB GIGABYTE', tipo: 'Placas de Video', stock: 28, precio: 580000, imagen: './images/GeForceRTX4060Ti.jpg' },
    { id: 2, nombre: 'MONITOR LG 27', tipo: 'Monitores', stock: 12, precio: 562000, imagen: './images/monitorLG27ultrag.jpg' },
    { id: 3, nombre: 'SAMSUNG Smart TV 70', tipo: 'TV', stock: 10, precio: 780000, imagen: './images/samsungsmart70Crystal.jpg' },
    { id: 4, nombre: 'Notebook Gamer Acer', tipo: 'Notebooks', stock: 30, precio: 1820000, imagen: './images/notebookAcer15.jpg' },
    { id: 5, nombre: 'Notebook Gamer MSI', tipo: 'Notebooks', stock: 7, precio: 2086000, imagen: './images/notebookMSI16.jpg' },
    { id: 6, nombre: 'Procesador Intel Core i7', tipo: 'Procesadores', stock: 14, precio: 387000, imagen: './images/procesadorIntelI7.jpg' },
    { id: 7, nombre: 'FC 25 PS4', tipo: 'Juegos', stock: 64, precio: 90000, imagen: './images/fc25ps4.jpg' },
    { id: 8, nombre: 'PlayStation 5 Slim Digital', tipo: 'Consolas', stock: 21, precio: 920400, imagen: './images/PlayStation5.jpg' }
];

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Función para renderizar los productos dinámicamente
const renderizarProductos = () => {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    productos.forEach(producto => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');

        productItem.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>${producto.tipo}</p>
            <p id="stock${producto.id}">Stock: ${producto.stock}</p>
            <p>Precio: $${producto.precio.toLocaleString()}</p>
            <label for="cantidad${producto.id}">Cantidad</label>
            <input id="cantidad${producto.id}" class="input-number" value="0" type="number" min="0">
            <button id="agregar${producto.id}">Agregar</button>
        `;

        productList.appendChild(productItem);

        document.getElementById(`agregar${producto.id}`).addEventListener('click', () => {
            const cantidad = parseInt(document.getElementById(`cantidad${producto.id}`).value);
            if (cantidad > 0) {
                agregarProducto(producto.id, cantidad);
            }
        });
    });
};

// Función para actualizar la vista del stock en el HTML
const actualizarVistaStock = () => {
    productos.forEach(producto => {
        const stockElemento = document.getElementById(`stock${producto.id}`);
        if (stockElemento) {
            stockElemento.textContent = `Stock: ${producto.stock}`;
        }
    });
};

// Función para agregar el producto al carrito
const agregarProducto = (productoId, cantidad) => {
    const producto = productos.find(prod => prod.id === productoId);
    if (producto.stock < cantidad) {
        alert(`Stock insuficiente para ${producto.nombre}`);
        return;
    }

    const productoEnCarrito = carrito.find(item => item.id === productoId);
    if (productoEnCarrito) {
        if (producto.stock >= productoEnCarrito.cantidad + cantidad) {
            productoEnCarrito.cantidad += cantidad;
        } else {
            alert(`Stock insuficiente para ${producto.nombre}`);
        }
    } else {
        carrito.push({...producto, cantidad});
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderizarCarrito();
    actualizarPrecioTotal();
    actualizarContadorCarrito(); // Llama a la función para actualizar el contador
};

// Asigna el evento a todos los botones de agregar
// for (let i = 1; i <= 8; i++) {
//     document.getElementById(`agregar${i}`).addEventListener('click', () => {
//         const cantidad = parseInt(document.getElementById(`cantidad${i}`).value);
//         if (cantidad > 0) {
//             agregarProducto(i, cantidad);
//         }
//     });
// }

// Renderiza el contenido del carrito
const renderizarCarrito = () => {
    const listaCart = document.getElementById('listaCart');
    listaCart.innerHTML = '';

    carrito.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `${item.nombre} - Precio Unitario: $${item.precio}` + "     ";

        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.value = item.cantidad;
        inputCantidad.min = 1;
        inputCantidad.max = productos.find(prod => prod.id === item.id).stock;
        inputCantidad.onchange = () => editarCantidad(item.id, parseInt(inputCantidad.value));
        
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.onclick = () => eliminarProductoDelCarrito(item.id);

        li.appendChild(inputCantidad);
        li.appendChild(btnEliminar);
        listaCart.appendChild(li);
    });
};

// Edita la cantidad de un producto en el carrito
const editarCantidad = (productoId, nuevaCantidad) => {
    const producto = productos.find(prod => prod.id === productoId);
    if (producto.stock >= nuevaCantidad) {
        const productoEnCarrito = carrito.find(item => item.id === productoId);
        productoEnCarrito.cantidad = nuevaCantidad;
        localStorage.setItem('carrito', JSON.stringify(carrito));
        renderizarCarrito();
        actualizarPrecioTotal();
        actualizarContadorCarrito(); // Llama a la función para actualizar el contador
    } else {
        alert(`Stock insuficiente para ${producto.nombre}`);
    }
};


// Elimina un producto del carrito
const eliminarProductoDelCarrito = (productoId) => {
    carrito = carrito.filter(item => item.id !== productoId);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderizarCarrito();
    actualizarPrecioTotal();
    actualizarContadorCarrito(); // Llama a la función para actualizar el contador
};

// Actualiza el precio total del carrito
const actualizarPrecioTotal = () => {
    const precioTotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    document.getElementById('precioTotal').textContent = `Precio Total: $${precioTotal}`;
};

// Evento para el formulario de compra
document.getElementById('compraFinal').addEventListener('submit', (e) => {
    e.preventDefault();
    if (carrito.length > 0) {
        carrito.forEach(item => {
            const producto = productos.find(prod => prod.id === item.id);
            producto.stock -= item.cantidad;
        });

        carrito = [];
        localStorage.setItem('carrito', JSON.stringify(carrito));
        renderizarCarrito();
        actualizarPrecioTotal();
        actualizarVistaStock();
        actualizarContadorCarrito(); // Actualiza el contador a 0
        document.getElementById('compraFinal').reset();
        document.getElementById('mensajeCompra').textContent = "Compra finalizada con éxito";

        // Reinicia todos los inputs de cantidad a 0
        productos.forEach(producto => {
            const inputCantidad = document.getElementById(`cantidad${producto.id}`);
            if (inputCantidad) {
                inputCantidad.value = 0;
            }
        });
    } else {
        document.getElementById('mensajeCompra').textContent = "El carrito está vacío";
    }
});

// Actualiza la cantidad de productos en el widget del carrito
const actualizarContadorCarrito = () => {
    const totalProductos = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    const contadorElemento = document.querySelector('.cart-widget-count');
    if (contadorElemento) {
        contadorElemento.textContent = totalProductos; // Cambia el número en el contador
    }
};

// Inicializa la aplicación
const app = () => {
    renderizarProductos();
    renderizarCarrito();
    actualizarPrecioTotal();
    actualizarVistaStock();
    actualizarContadorCarrito();
};

app();
