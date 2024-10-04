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
           entregado: false,
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




function agregarAlPedido1(nombre) {
    listaPedidos.push({ nombre  });
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
        entregado: pedido.entregado,
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
       botonPedido.className = "boton-pedido";
        if (pedido.entregado) {
            botonPedido.classList.add("entregado"); // Aplicar clase adicional si está entregado
        }

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
  
  if (!pedido.entregado) { // Si el pedido aún no se ha entregado
        const botonEntregar = document.createElement("button");
        botonEntregar.innerText = "Marcar como Entregado";
         botonEntregar.style.backgroundColor = "green";
     botonEntregar.style.color = "white";
        botonEntregar.onclick = function() {
            marcarComoEntregado(pedido);
        };
        detallesPedido.appendChild(botonEntregar);
    } else {
        const estadoEntregado = document.createElement("p");
        estadoEntregado.innerHTML = `<strong>Estado: Entregado</strong>`;
        detallesPedido.appendChild(estadoEntregado);
    }
  
  
  
  
   // Botón para eliminar el pedido
    const botonEliminar = document.createElement("button");
    botonEliminar.innerText = "Eliminar Pedido";
    botonEliminar.style.backgroundColor = "red"; // Color rojo para el botón
    botonEliminar.style.color = "white";
    botonEliminar.onclick = () => confirmarEliminacion(pedido);
    detallesPedido.appendChild(botonEliminar);
  
  
  

    // Mostrar la ventana emergente
    const ventanaEmergente = document.getElementById("ventanaEmergente");
    ventanaEmergente.style.display = "block";
    ventanaEmergente.style.top = "0"; // Alinea en la parte superior
    ventanaEmergente.style.left = event.target.getBoundingClientRect().left + "px"; // Posición horizontal
}



const nuevoPedido = {
    id: pedidosRealizados.length + 1,
    detalles: listaPedidos,
    total: total,
    entregado: false // Campo entregado se inicializa como falso
};




function marcarComoEntregado(pedido) {
    pedido.entregado = true; // Marcar el pedido como entregado

    // Guardar la base de datos actualizada en localStorage
    guardarDatosLocal();

    // Ocultar la ventana emergente después de marcar como entregado
    cerrarVentana();

    // Opcional: puedes actualizar la interfaz para reflejar el cambio si es necesario.
    mostrarBotonesPedidos();
  
}

function confirmarEliminacion(pedido) {
    // Crear una ventana de confirmación con estilo
    const confirmacion = document.createElement("div");
    confirmacion.id = "confirmacionEliminacion";
    confirmacion.style.position = "fixed";
    confirmacion.style.top = "50%";
    confirmacion.style.left = "50%";
    confirmacion.style.transform = "translate(-50%, -50%)";
    confirmacion.style.backgroundColor = "red";
    confirmacion.style.padding = "20px";
    confirmacion.style.color = "white";
    confirmacion.style.borderRadius = "5px";
    confirmacion.style.textAlign = "center";

    const mensaje = document.createElement("p");
    mensaje.innerText = "¿Estás seguro de que deseas eliminar este pedido?";
    confirmacion.appendChild(mensaje);

    // Botón de Confirmar
    const botonConfirmar = document.createElement("button");
    botonConfirmar.innerText = "Confirmar";
    botonConfirmar.style.backgroundColor = "white";
    botonConfirmar.style.color = "red";
    botonConfirmar.onclick = () => eliminarPedido(pedido, confirmacion);
    confirmacion.appendChild(botonConfirmar);

    // Botón de Cancelar
    const botonCancelar = document.createElement("button");
    botonCancelar.innerText = "Cancelar";
    botonCancelar.style.marginLeft = "10px";
    botonCancelar.onclick = () => document.body.removeChild(confirmacion);
    confirmacion.appendChild(botonCancelar);

    // Mostrar la ventana de confirmación
    document.body.appendChild(confirmacion);
}
function eliminarPedido(pedido, confirmacion) {
  
   totalVentasAcumuladas -= pedido.total;
    // Remover el pedido de la lista
    pedidosRealizados = pedidosRealizados.filter(p => p.id !== pedido.id);

    // También eliminar el pedido de la base de datos según la fecha
    const fechaActual = pedido.detalles[0].fecha || new Date().toISOString().split('T')[0];
    baseDeDatos[fechaActual] = baseDeDatos[fechaActual].filter(v => v.id !== pedido.id);

    // Guardar los cambios en localStorage
    guardarDatosLocal();

    // Remover la ventana de confirmación
    document.body.removeChild(confirmacion);

    // Actualizar la lista de botones de pedidos
    mostrarBotonesPedidos();
    
    // Cerrar la ventana de detalles de pedido
    cerrarVentana();
  const totalVentasElement = document.getElementById("total-ventas");
    if (totalVentasElement) {
        totalVentasElement.innerText = `Total de Ventas: $${totalVentasAcumuladas.toFixed(2)}`;
    }
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
    const historial = [];
    
    // Agregar encabezados personalizados al historial
    historial.push(["ID", "Fecha", "Usuario", "Producto", "Cantidad", "Presa Seleccionada", "Precio Unitario", "Precio Total"]);

    // Inicializar total acumulado
    let totalAcumulado = 0;

    // Iterar sobre las fechas en la base de datos
    for (const fecha in baseDeDatos) {
        baseDeDatos[fecha].forEach(venta => {
            // Obtener detalles del pedido
            const detalles = JSON.parse(venta.detalles); // Asegúrate de parsear los detalles que son JSON

            // Iterar sobre cada producto en el pedido
            detalles.forEach((producto) => {
                const nombreProducto = producto.nombre.includes("(") ? producto.nombre.split(" (")[0] : producto.nombre; // Extraer el nombre sin la presa
                const presaSeleccionada = producto.nombre.includes("(") ? producto.nombre.split(" (")[1].replace(")", "") : "N/A"; // Extraer la presa
                const cantidad = 1; // Asumir que cada producto tiene cantidad 1

                const fila = [
                    venta.id,
                    venta.fecha,
                    venta.usuario,
                    nombreProducto,
                    cantidad,
                    presaSeleccionada,  // Presa si existe
                    producto.precio.toFixed(2),  // Precio unitario
                    (producto.precio * cantidad).toFixed(2)  // Precio total del producto
                ];
                historial.push(fila);

                // Sumar al total acumulado
                totalAcumulado += producto.precio * cantidad;
            });
        });
    }

    // Convertir el historial a una hoja de Excel
    const ws = XLSX.utils.aoa_to_sheet(historial);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Historial Ventas");

    // Crear una fila para el total acumulado
    const totalRow = [
        "", "", "", "", "", "Total Acumulado:", "", totalAcumulado.toFixed(2) // Aquí colocas el total acumulado
    ];

    // Agregar la fila de total acumulado al final de la hoja
    XLSX.utils.sheet_add_aoa(ws, [totalRow], { origin: -1 });

    // Aplicar estilos a la fila del total acumulado
    const range = XLSX.utils.decode_range(ws['!ref']); // Obtener el rango de la hoja

    // Añadir estilos a la fila total (última fila)
    const totalRowIndex = range.e.r + 1; // Índice de la fila total acumulado
    for (let colIndex = range.s.c; colIndex <= range.e.c; colIndex++) {
        const cellAddress = XLSX.utils.encode_cell({ c: colIndex, r: totalRowIndex });
        if (!ws[cellAddress]) {
            ws[cellAddress] = {}; // Crear la celda si no existe
        }
        ws[cellAddress].s = { fill: { fgColor: { rgb: "00FF00" } } }; // Color de fondo verde
        ws[cellAddress].v = totalRow[colIndex]; // Asignar el valor
    }

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












function agregarAlPedidoConPresa(nombreProductoConPresa, precio) {
    // Agregar el producto al pedido junto con la presa seleccionada
    listaPedidos.push({ nombre: nombreProductoConPresa, precio });
    contador++;
    total += precio;

    // Actualizar el contador y el total en el UI
    document.getElementById("contador").innerText = contador;
    document.getElementById("total").innerText = total.toFixed(2);

    // Actualizar la lista visual de pedidos
    actualizarPedido();
}

function mostrarSelector(nombreProducto, precio, opcionesPermitidas, event) {
    const selector = document.getElementById("selector-presa");
    selector.style.display = "block"; // Mostrar el selector

    // Ajustar la posición del selector
    const rect = event.target.getBoundingClientRect();
    selector.style.top = `${rect.top + window.scrollY + rect.height}px`;
    selector.style.left = `${rect.left + window.scrollX}px`;

    productoSeleccionado = { nombre: nombreProducto, precio: precio };
    maxSeleccion = opcionesPermitidas;

    // Resetear los checkboxes
    document.querySelectorAll("#selector-presa input[type=checkbox]").forEach(checkbox => {
        checkbox.checked = false;
    });
}

document.querySelectorAll("#selector-presa input[type=checkbox]").forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const seleccionados = document.querySelectorAll("#selector-presa input[type=checkbox]:checked").length;
        if (seleccionados > maxSeleccion) {
            this.checked = false;
            alert(`Solo puede seleccionar ${maxSeleccion} opción(es).`);
        }
    });
});

function confirmarSeleccion() {
    const selecciones = [];
    document.querySelectorAll("#selector-presa input[type=checkbox]:checked").forEach(checkbox => {
        selecciones.push(checkbox.value);
    });

    if (selecciones.length === 0) {
        alert('Debe seleccionar al menos una presa.');
        return;
    }

    agregarAlPedidoConPresa(productoSeleccionado.nombre + " (" + selecciones.join(", ") + ")", productoSeleccionado.precio);

    // Ocultar el selector después de confirmar la selección
    document.getElementById("selector-presa").style.display = "none";
}
