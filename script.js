let total = 0;
let contador = 0;
let listaPedidos = [];

let pedidosRealizados = [];
let totalVentasAcumuladas = 0; // Ensure it's declared and initialized
let baseDeDatos = {
    "2024-09-25": [
        {
            id: 1,
            fecha: "2024-09-25",
            usuario: "ROSARIO",
            total_venta: 100.00,
            detalles: JSON.stringify([{ nombre: "Producto A", precio: 50 }, { nombre: "Producto B", precio: 50 }])
        },
        // Más ventas...
    ],
    // Más fechas...
};

// Cargar datos cuando se inicia la aplicación
cargarDatosLocal();

// Llama a esta función cada vez que se envíe un pedido
function enviarPedido() {
    if (listaPedidos.length > 0) {
        const nuevoPedido = {
            id: pedidosRealizados.length + 1,
            detalles: listaPedidos,
            total: total
        };

        // Guardar en la "base de datos"
        guardarVenta(nuevoPedido);

        pedidosRealizados.push(nuevoPedido);
        mostrarBotonesPedidos();
        resetearPedido();
    }
}

// Guardar la base de datos en localStorage
function guardarDatosLocal() {
    localStorage.setItem('ventas', JSON.stringify(baseDeDatos));
}

// Cargar la base de datos desde localStorage
function cargarDatosLocal() {
    const datosGuardados = localStorage.getItem('ventas');
    if (datosGuardados) {
        baseDeDatos = JSON.parse(datosGuardados);
    }
}

// Llama a esta función cuando inicie tu aplicación
cargarDatosLocal();

// Función para agregar un producto al pedido
function agregarAlPedido(nombre, precio) {
    listaPedidos.push({ nombre, precio });
    contador++;
    total += precio;

    document.getElementById("contador").innerText = contador;
    document.getElementById("total").innerText = total.toFixed(2);
    actualizarPedido();
}

// Función para actualizar el listado de productos en el pedido
function actualizarPedido() {
    const lista = document.getElementById("lista-pedido");
    lista.innerHTML = ''; // Limpiar la lista actual

    listaPedidos.forEach(producto => {
        const item = document.createElement("li");
        item.innerText = `${producto.nombre} - $${producto.precio.toFixed(2)}`;
        lista.appendChild(item);
    });
}

// Función para eliminar el último producto agregado
function eliminarUltimo() {
    if (listaPedidos.length > 0) {
        const ultimoProducto = listaPedidos.pop();
        contador--;
        total -= ultimoProducto.precio;

        document.getElementById("contador").innerText = contador;
        document.getElementById("total").innerText = total.toFixed(2); // Total temporal
        actualizarPedido();
    }
}

// Función para guardar la venta en la base de datos
function guardarVenta(pedido) {
    const fechaActual = new Date().toISOString().split('T')[0]; // Obtener la fecha actual en formato YYYY-MM-DD
    const venta = {
        id: baseDeDatos[fechaActual] ? baseDeDatos[fechaActual].length + 1 : 1,
        fecha: fechaActual,
        usuario: "ROSARIO",
        total_venta: pedido.total,
        detalles: JSON.stringify(pedido.detalles) // Guardar detalles como JSON
    };

    // Agregar la venta a la base de datos
    if (!baseDeDatos[fechaActual]) {
        baseDeDatos[fechaActual] = []; // Crear un nuevo array para esa fecha
    }
    baseDeDatos[fechaActual].push(venta); 

    // Actualizar el total acumulado
    totalVentasAcumuladas += pedido.total; // Make sure this line is not causing an error

    // Guardar la base de datos en localStorage
    guardarDatosLocal();
}

// Función para mostrar los botones de los pedidos realizados
function mostrarBotonesPedidos() {
    const contenedorBotones = document.getElementById("botones-pedidos");
    contenedorBotones.style.display = "block"; // Mostrar contenedor de botones
    contenedorBotones.innerHTML = ''; // Limpiar botones anteriores

    pedidosRealizados.forEach((pedido) => {
        const botonPedido = document.createElement("button");
        botonPedido.className = "boton-pedido"; 
        botonPedido.innerText = `Pedido N°${pedido.id}`;
        botonPedido.onclick = (event) => mostrarDetallesPedido(pedido, event);
        contenedorBotones.appendChild(botonPedido);
    });
}

function mostrarDetallesPedido(pedido, event) {
    const detallesPedido = document.getElementById("detalles-pedido");
    detallesPedido.innerHTML = ''; // Limpiar detalles anteriores

    // Crear un objeto para contar la cantidad de cada producto
    const conteoProductos = {};

    // Contar la cantidad de cada producto
    pedido.detalles.forEach((producto) => {
        if (conteoProductos[producto.nombre]) {
            conteoProductos[producto.nombre] += 1; // Incrementa el conteo si ya existe
        } else {
            conteoProductos[producto.nombre] = 1; // Inicializa el conteo
        }
    });

    // Mostrar los productos agrupados
    for (const [nombre, cantidad] of Object.entries(conteoProductos)) {
        const item = document.createElement("p");
        item.innerText = `${cantidad} ${nombre}`; // Muestra la cantidad y el nombre del producto
        detallesPedido.appendChild(item);
    }
    
    const totalPedido = document.createElement("p");
    totalPedido.innerHTML = `<strong>Total: $${pedido.total.toFixed(2)}</strong>`;
    detallesPedido.appendChild(totalPedido);

    // Mostrar la ventana emergente
    const ventanaEmergente = document.getElementById("ventanaEmergente");
    ventanaEmergente.style.display = "block";
    ventanaEmergente.style.top = "0"; // Alinea en la parte superior
    ventanaEmergente.style.left = event.target.getBoundingClientRect().left + "px"; // Posición horizontal
}

// Cerrar ventana emergente
function cerrarVentana() {
    document.getElementById("ventanaEmergente").style.display = "none";
}

// Función para resetear el pedido actual
function resetearPedido() {
    total = 0;
    contador = 0;
    listaPedidos = [];

    document.getElementById("contador").innerText = contador;
    document.getElementById("total").innerText = total.toFixed(2); // Total temporal
    actualizarPedido();
}

// Mostrar y ocultar el formulario de login
function mostrarLogin() {
    document.getElementById("loginForm").style.display = "block";
}

function cerrarLogin() {
    document.getElementById("loginForm").style.display = "none";
}

// Validar usuario y contraseña
function validarLogin() {
    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;

    if (usuario === "ROSARIO" && password === "7327352") {
        cerrarLogin(); // Cierra la ventana si el login es correcto
        mostrarRegistros(); // Muestra la ventana de registros
    } else {
        document.getElementById("mensaje-error").style.display = "block";
    }
    return false; // Evita que el formulario se envíe
}

// Mostrar la ventana de registros
function mostrarRegistros() {
    document.getElementById("registros").style.display = "block";
    document.getElementById("total-ventas").innerText = `Total de Ventas: $${totalVentasAcumuladas.toFixed(2)}`; // Mostrar total
    mostrarDetallesVentas();
}

// Función para mostrar detalles de las ventas
function mostrarDetallesVentas() {
    const detallesVentas = document.getElementById("detalles-ventas");
    detallesVentas.innerHTML = ''; // Limpiar detalles anteriores

    // Iterar sobre las fechas en la base de datos
    for (const fecha in baseDeDatos) {
        const fechaElement = document.createElement("h3");
        fechaElement.innerText = `Ventas del ${fecha}`;
        detallesVentas.appendChild(fechaElement);

        baseDeDatos[fecha].forEach(venta => {
            const item = document.createElement("p");
            item.innerText = `ID: ${venta.id}, Total: $${venta.total_venta.toFixed(2)}, Detalles: ${venta.detalles}`;
            detallesVentas.appendChild(item);
        });
    }
}

// Cerrar la ventana de registros
function cerrarRegistros() {
    document.getElementById("registros").style.display = "none";
}

function descargarHistorialVentas() {
    // Crear un array para almacenar las filas del archivo Excel
    const historial = [];
    
    // Agregar encabezados al historial
    historial.push(["ID", "Fecha", "Usuario", "Total Venta", "Detalles"]);

    // Iterar sobre las fechas en la base de datos
    for (const fecha in baseDeDatos) {
        baseDeDatos[fecha].forEach(venta => {
            const fila = [
                venta.id,
                venta.fecha,
                venta.usuario,
                venta.total_venta,
                venta.detalles
            ];
            historial.push(fila);
        });
    }

    // Convertir el historial a una hoja de Excel
    const ws = XLSX.utils.aoa_to_sheet(historial);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Historial Ventas");

    // Descargar el archivo Excel
    XLSX.writeFile(wb, "historial_ventas.xlsx");
}

function descargarVentasEnExcel() {
    // Crear un array para almacenar las filas del archivo Excel
    const historial = []; // Asegúrate de declarar la variable aquí
    
    // Agregar encabezados al historial
    historial.push(["ID", "Fecha", "Usuario", "Total Venta", "Detalles"]);

    // Iterar sobre las fechas en la base de datos
    for (const fecha in baseDeDatos) {
        baseDeDatos[fecha].forEach(venta => {
            const fila = [
                venta.id,
                venta.fecha,
                venta.usuario,
                venta.total_venta,
                venta.detalles
            ];
            historial.push(fila);
        });
    }

    // Convertir el historial a una hoja de Excel
    const ws = XLSX.utils.aoa_to_sheet(historial);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Historial Ventas");

    // Obtener la fecha actual
    const fechaActual = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

    // Descargar el archivo Excel con la fecha
    XLSX.writeFile(wb, `historial_ventas_${fechaActual}.xlsx`);
}


// Verificar y manejar registros al llegar a las 23:59
function verificarHoraYGestionarRegistros() {
    const ahora = new Date();
    const horaActual = ahora.getHours();
    const minutosActuales = ahora.getMinutes();

    // Si son las 23:59, realiza alguna acción (por ejemplo, restablecer el contador)
    if (horaActual === 23 && minutosActuales === 59) {
        totalVentasAcumuladas = 0; // Resetea el total acumulado
    }
}

// Llamar a verificarHoraYGestionarRegistros cada minuto
setInterval(verificarHoraYGestionarRegistros, 60000);


function agregarAlPedido(nombre, precio) {
    listaPedidos.push({ nombre, precio });
    contador++;
    total += precio;

    document.getElementById("contador").innerText = contador;
    document.getElementById("total").innerText = total.toFixed(2);
    actualizarPedido();
}