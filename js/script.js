// Lista de productos
const productos = [
    {id: 1, nombre: 'GEFORCE RTX 4060 TI 8GB GIGABYTE', tipo: 'Placas de Video', stock: 28, precio: 580000},
    {id: 2, nombre: 'MONITOR LG 27', tipo: 'Monitores', stock: 12, precio: 562000},
    {id: 3, nombre: 'SAMSUNG Smart TV 70', tipo: 'TV', stock: 10, precio: 780000}, 
    {id: 4, nombre: 'Notebook Gamer Acer', tipo: 'Notebooks', stock: 30, precio: 1820000}, 
    {id: 5, nombre: 'Notebook Gamer MSI', tipo: 'Notebooks', stock: 7, precio: 2086000}, 
    {id: 6, nombre: 'Procesador Intel Core i7', tipo: 'Procesadores', stock: 14, precio: 387000}
];

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Función para agregar el producto al carrito
const agregarProducto = (productoId, cantidad) => {
    const producto = productos.find(prod => prod.id === productoId);
    const productoEnCarrito = carrito.find(item => item.id === productoId);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad += cantidad;
    } else {
        carrito.push({...producto, cantidad});
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderizarCarrito();
    actualizarPrecioTotal();
};

// Asigna el evento a todos los botones de agregar
for (let i = 1; i <= 6; i++) {
    document.getElementById(`agregar${i}`).addEventListener('click', () => {
        const cantidad = parseInt(document.getElementById(`cantidad${i}`).value);
        if (cantidad > 0) {
            agregarProducto(i, cantidad);
        }
    });
}

// Renderiza el contenido del carrito
const renderizarCarrito = () => {
    const listaCart = document.getElementById('listaCart');
    listaCart.innerHTML = '';

    carrito.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.nombre} - Cantidad: ${item.cantidad} - Precio: $${item.precio * item.cantidad}`;
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.onclick = () => eliminarProductoDelCarrito(item.id);
        li.appendChild(btnEliminar);
        listaCart.appendChild(li);
    });
};

// Elimina un producto del carrito
const eliminarProductoDelCarrito = (productoId) => {
    carrito = carrito.filter(item => item.id !== productoId);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderizarCarrito();
    actualizarPrecioTotal();
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
        carrito = [];
        localStorage.setItem('carrito', JSON.stringify(carrito));
        renderizarCarrito();
        actualizarPrecioTotal();
        document.getElementById('compraFinal').reset(); // Reinicia el formulario de compra
        document.getElementById('mensajeCompra').innerHTML = "Compra finalizada con éxito"; // Muestra mensaje de éxito
        
        // Reinicia todos los inputs de cantidad a 0
        for (let i = 1; i <= 6; i++) {
            document.getElementById(`cantidad${i}`).value = 0;
        }
    } else {
        document.getElementById('mensajeCompra').innerHTML = "El carrito está vacío"; // Muestra mensaje de carrito vacío
    }
});


// Inicializa la aplicación
const app = () => {
    renderizarCarrito();
    actualizarPrecioTotal();
};

app();
