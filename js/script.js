let productos = [];
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Función asincrónica para cargar productos desde un archivo JSON
const cargarProductos = async () => {
    try {
        const response = await fetch('./productos.json');
        if (!response.ok) {
            throw new Error('Error al cargar los productos');
        }
        productos = await response.json();
        renderizarProductos();
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema al cargar los productos. Por favor, inténtalo de nuevo más tarde.');
    }
};

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
    actualizarContadorCarrito();

    // Mostrar notificación con Toastify
    mostrarToastAgregar(producto.nombre);
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
        document.getElementById('compraFinal').reset();
        document.getElementById('mensajeCompra').innerHTML = "Compra finalizada con éxito";
        actualizarContadorCarrito();

        // Mostrar notificación con Toastify
        mostrarToastCompra();

        // Reinicia todos los inputs de cantidad a 0
        for (let i = 1; i <= productos.length; i++) {
            document.getElementById(`cantidad${i}`).value = 0;
        }
    } else {
        document.getElementById('mensajeCompra').innerHTML = "El carrito está vacío";
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

// ToastifyJS
// Mostrar un mensaje al agregar un producto al carrito
const mostrarToastAgregar = () => {
    Toastify({
        text: `Producto agregado al carrito!`,
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
            background: "linear-gradient(90deg, rgba(0,28,130,1) 0%, rgba(0,97,255,1) 52%, rgba(0,230,255,1) 100%)",
            // background: "linear-gradient(90deg, rgba(75,0,130,1) 0%, rgba(147,0,255,1) 35%, rgba(200,200,200,1) 100%)",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "8px",
            padding: "10px",
        },
    }).showToast();
};

// Mostrar un mensaje al finalizar la compra
const mostrarToastCompra = () => {
    Toastify({
        text: "🎉 Compra finalizada con éxito. ¡Gracias por tu compra!",
        duration: 4000,
        gravity: "top",
        position: "right",
        style: {
            background: "linear-gradient(90deg, rgba(0,28,130,1) 0%, rgba(0,97,255,1) 52%, rgba(0,230,255,1) 100%)",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "8px",
            padding: "10px",
        },
    }).showToast();
};

// Inicializa la aplicación
const app = async () => {
    await cargarProductos();
    renderizarCarrito();
    actualizarPrecioTotal();
    actualizarVistaStock();
    actualizarContadorCarrito();
};

app();
