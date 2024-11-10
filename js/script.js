// ALGORITMO
let total = 0;
const productos = [
    {id: 1, nombre: 'Notebook', precio: 1200}, 
    {id: 2, nombre: 'Smartphone', precio: 1000}, 
    {id: 3, nombre: 'Tablet', precio: 450},
    {id: 4, nombre: 'Monitor', precio: 1350}
];

const datosUsuario = {
    usuarios: [
        { nombre: "mateo", contrasenia: "123" },
        { nombre: "admin", contrasenia: "456" }
    ],
    ingreso: false
};

function login(intentos, maximaCantidadIntentos) {
    alert(`HOLA! Inicia Sesión en SALVATEK Electronics, tiene ${maximaCantidadIntentos} intentos posibles de ingresar, este es su intento ${intentos + 1}`);
    const usuarioIngresado = prompt("Ingrese su nombre").toLocaleLowerCase();
    const contraseniaIngresada = prompt("Ingrese la contraseña");

    const usuarioEncontrado = datosUsuario.usuarios.find(usuario => usuario.nombre === usuarioIngresado && usuario.contrasenia === contraseniaIngresada);

    if (usuarioEncontrado) {
        alert("Bienvenido");
        datosUsuario.ingreso = true;
        datosUsuario.usuarioLogueado = usuarioEncontrado;
        return true;
    } else {
        alert(`Le quedan ${maximaCantidadIntentos - (intentos + 1)} intentos`);
        return false;
    }
}

function loginLoop(intentos, maximaCantidadIntentos) {
    while (!datosUsuario.ingreso && intentos < maximaCantidadIntentos) {
        datosUsuario.ingreso = login(intentos, maximaCantidadIntentos);
        intentos++;
    }
}


function calcularPrecioConIVA(precio) {
    const iva = (precio * 21) / 100;
    return precio + iva;
}

function agregarAlTotal(precioFinal) {
    total += precioFinal;
}

const agregarProducto = () => {
    const id = parseInt(prompt('Ingresa el id del producto: '));
    const nombre = prompt('Ingresa el nombre del producto: ');
    const precio = parseFloat(prompt('Ingresa el precio del producto: '));

    if (!isNaN(id) && !isNaN(precio) && nombre) {
        const producto = { id, nombre, precio };
        productos.push(producto);
        alert("Producto agregado exitosamente.");
    } else {
        alert("Error: Datos inválidos para el producto.");
    }
};


const programaDeVentas = () => {
    let rtaInicial = confirm("HOLA!, Bienvenido a SALVATEK Electronics, ¿Desea realizar alguna compra? (S/N): ");

    while (rtaInicial) {
        const opcion = prompt("¿Qué desea comprar de nuestro catálogo?:\n1. Notebook\n2. Smartphone\n3. Tablet\n4. Monitor");

        if (opcion >= '1' && opcion <= '4') {
            const productoSeleccionado = productos[opcion - 1];
            const confirmar = confirm('Nuestro ' + productoSeleccionado.nombre + ' SALVATEK cuesta ' + productoSeleccionado.precio + '$ sin impuestos, ¿Deseas realizar la compra?');

            if (confirmar) {
                const precioFinal = calcularPrecioConIVA(productoSeleccionado.precio);
                console.log('¡¡Compra realizada con éxito!!, Precio final: ' + precioFinal + '$.');
                agregarAlTotal(precioFinal);
            } else {
                console.log('Compra Cancelada.');
            }
        } else {
            alert('ERROR');
        }

        rtaInicial = confirm("¿Desea realizar alguna otra compra? (S/N): ");
    }

    if (total > 0) {
        console.log('El total acumulado de tus compras es: ' + total + '$.');
    }
}

const modificarProducto = () => {
    const id = parseInt(prompt("Ingresa el id del producto a modificar: "));
    
    // Encontrar el producto por su id
    const producto = productos.find(p => p.id === id);
    
    if (producto) {
        const nuevoNombre = prompt(`Ingresa el nuevo nombre para el producto (${producto.nombre}): `);
        const nuevoPrecio = parseFloat(prompt(`Ingresa el nuevo precio para el producto (${producto.precio}$): `));

        if (nuevoNombre) producto.nombre = nuevoNombre;
        if (!isNaN(nuevoPrecio)) producto.precio = nuevoPrecio;
        
        alert("Producto modificado: " + producto.nombre + ", Precio: " + producto.precio );
    } else {
        alert("Producto no encontrado.");
    }
};

const modificarProgramaDeVentas = () => {
    let rtaInicial = prompt("HOLA Admin!, Bienvenido a SALVATEK Electronics, ¿Qué operación desea realizar?:\n1. Agregar producto.\n2. Modificar producto.");
    let rtaInicialOperac;

    do {
        if (rtaInicial === '1') {
            agregarProducto();
        } else if (rtaInicial === '2') {
            modificarProducto();
        } else {
            alert('ERROR');
        }

        rtaInicialOperac = confirm("¿Desea realizar alguna otra operación? (S/N): ");
    } while (rtaInicialOperac);
}

const inicializar = () => {
    let intentos = 0;
    const maximaCantidadDeIntentos = 3;
    loginLoop(intentos, maximaCantidadDeIntentos);

    if (datosUsuario.ingreso) {
        if (datosUsuario.usuarioLogueado.nombre === "admin") {
            modificarProgramaDeVentas();
        } else {
            programaDeVentas();
        }
    }
}

inicializar();
