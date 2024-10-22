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

function login(intentos, maximaCantidadIntentos){
    alert(`HOLA! Inicia Sesión en SALVATEK Electronics, Tiene ${maximaCantidadIntentos} intentos posibles de ingresar, este es su intento ${intentos+1}`);
    let usuarioIngresado = prompt("Ingrese su nombre").toLocaleLowerCase();
    let contraseniaIngresada = prompt("Ingrese la contraseña");

    const usuarioEncontrado = datosUsuario.usuarios.find(usuario => usuario.nombre === usuarioIngresado && usuario.contrasenia === contraseniaIngresada);

    if (usuarioEncontrado) {
        alert("Bienvenido");
        datosUsuario.ingreso = true;
        datosUsuario.usuarioLogueado = usuarioEncontrado;
        return true;
    } else {
        alert(`Le quedan ${maximaCantidadIntentos-(intentos+1)} intentos`);
    }
}

function loginLoop(intentos, maximaCantidadIntentos){
    do {
        if (login(intentos, maximaCantidadIntentos)) {
            break;
        }
        intentos++;
    } while(intentos < maximaCantidadIntentos);
}

function calcularPrecioConIVA(precio) {
    let iva = (precio * 21) / 100;
    return precio + iva;
}

function agregarAlTotal(precioFinal) {
    total += precioFinal;
}

const agregarProducto = () => {
    let id = parseInt(prompt('Ingresa el id del producto: '));
    let nombre = prompt('Ingresa el nombre del producto: ');
    let precio = parseFloat(prompt('Ingresa el precio del producto: '));

    let producto = {id, nombre, precio};
    productos.push(producto);
}

const programaDeVentas = () => {
    let rtaInicial = prompt("HOLA!, Bienvenido a SALVATEK Electronics, ¿Desea realizar alguna compra? (S/N): ");

    while (rtaInicial === 'S' || rtaInicial === 's') {
        let opcion = prompt("¿Qué desea comprar de nuestro catálogo?:\n1. Notebook\n2. Smartphone\n3. Tablet\n4. Monitor");

        if (opcion >= '1' && opcion <= '4') {
            let productoSeleccionado = productos[opcion - 1];
            let confirmar = confirm('Nuestro ' + productoSeleccionado.nombre + ' SALVATEK cuesta ' + productoSeleccionado.precio + '$ sin impuestos, ¿Deseas realizar la compra?');

            if (confirmar) {
                let precioFinal = calcularPrecioConIVA(productoSeleccionado.precio);
                console.log('¡¡Compra realizada con éxito!!, Precio final: ' + precioFinal + '$.');
                agregarAlTotal(precioFinal);
            } else {
                console.log('Compra Cancelada.');
            }
        } else {
            alert('ERROR');
        }

        rtaInicial = prompt("¿Desea realizar alguna otra compra? (S/N): ");
    }

    if (total > 0) {
        console.log('El total acumulado de tus compras es: ' + total + '$.');
    }
}

const modificarProducto = () => {
    let id = parseInt(prompt("Ingresa el id del producto a modificar: "));
    
    // Encontrar el producto por su id
    let producto = productos.find(p => p.id === id);
    
    if (producto) {
        let nuevoNombre = prompt(`Ingresa el nuevo nombre para el producto (${producto.nombre}): `);
        let nuevoPrecio = parseFloat(prompt(`Ingresa el nuevo precio para el producto (${producto.precio}$): `));

        if (nuevoNombre) producto.nombre = nuevoNombre;
        if (!isNaN(nuevoPrecio)) producto.precio = nuevoPrecio;
        
        alert("Producto modificado: " + producto.nombre + ", Precio: " + producto.precio );
    } else {
        alert("Producto no encontrado.");
    }
};

const modificarProgramaDeVentas = () => {
    let rtaInicial = prompt("HOLA Admin!, Bienvenido a SALVATEK Electronics, ¿Qué operación desea realizar?:\n1. Agregar producto.\n2. Modificar producto.");

    do {
        if (rtaInicial === '1') {
            agregarProducto();
        } else if (rtaInicial === '2') {
            modificarProducto();
        } else {
            alert('ERROR');
        }

        rtaInicial = prompt("¿Desea realizar alguna otra operación? (S/N): ");
    } while (rtaInicial === 'S' || rtaInicial === 's');
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
