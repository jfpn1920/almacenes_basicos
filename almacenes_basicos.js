//-------------------------------------//
//--|funcionalidad_almacenes_basicos|--//
//-------------------------------------//
const formulario = document.getElementById("formulario_producto");
const nombre_producto = document.getElementById("nombre_producto");
const precio_producto = document.getElementById("precio_producto");
const cantidad_producto = document.getElementById("cantidad_producto");
const tabla_productos = document.getElementById("tabla_productos");
const total_productos = document.getElementById("total_productos");
const total_unidades = document.getElementById("total_unidades");
const valor_inventario = document.getElementById("valor_inventario");
const mensaje_vacio = document.getElementById("mensaje_vacio");
const vaciar_inventario = document.getElementById("vaciar_inventario");
//------------------------------------------------------//
//--|datos_guardados_de_productos_usando_localstorage|--//
//------------------------------------------------------//
let productos = JSON.parse(localStorage.getItem("productos_almacen")) || [];
let producto_editando = null;
function guardar_productos() {
    localStorage.setItem("productos_almacen", JSON.stringify(productos));
}
//-----------------------//
//--|mostrar_productos|--//
//-----------------------//
function mostrar_productos() {
    tabla_productos.innerHTML = "";
    let unidades = 0;
    let valor = 0;
    productos.forEach(
        function(producto, indice) {
            const total = producto.precio * producto.cantidad;
            unidades += producto.cantidad;
            valor += total;
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${indice + 1}</td>
                <td><strong>${producto.nombre}</strong></td>
                <td>$${producto.precio.toFixed(2)}</td>
                <td>${producto.cantidad}</td>
                <td>$${total.toFixed(2)}</td>
                <td>
                    <div class="acciones">
                        <button class="boton_editar" onclick="editar_producto(${indice})" title="Editar"><i class="fa-solid fa-pen"></i></button>
                        <button class="boton_eliminar" onclick="eliminar_producto(${indice})" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>
            `;
            tabla_productos.appendChild(fila);
        }
    );
    total_productos.textContent = productos.length;
    total_unidades.textContent = unidades;
    valor_inventario.textContent = "$" + valor.toFixed(2);
    if (productos.length === 0) {
        mensaje_vacio.style.display = "block";
    } else {
        mensaje_vacio.style.display = "none";
    }
}
//----------------------//
//--|agregar_producto|--//
//----------------------//
formulario.addEventListener(
    "submit",
    function(evento) {
        evento.preventDefault();
        const nombre = nombre_producto.value .trim();
        const precio = Number(precio_producto.value);
        const cantidad = Number(cantidad_producto.value);
        if (nombre === "" || precio <= 0 || cantidad <= 0) {
            alert("Completa correctamente los datos.");
            return;
        }
        const producto = {
            nombre: nombre,
            precio: precio,
            cantidad: cantidad
        };
        if (producto_editando === null) {
            productos.push(producto);
        } else {
            productos[producto_editando] = producto;
            producto_editando = null;
        }
        guardar_productos();
        mostrar_productos();
        formulario.reset();
        nombre_producto.focus();
    }
);
//---------------------//
//--|editar_producto|--//
//---------------------//
function editar_producto(indice) {
    const producto = productos[indice];
    nombre_producto.value = producto.nombre;
    precio_producto.value = producto.precio;
    cantidad_producto.value = producto.cantidad;
    producto_editando = indice;
    nombre_producto.focus();
}
//-----------------------//
//--|eliminar_producto|--//
//-----------------------//
function eliminar_producto(indice) {
    const confirmar = confirm("¿Deseas eliminar este producto?");
    if (!confirmar) {
        return;
    }
    productos.splice(indice, 1);
    guardar_productos();
    mostrar_productos();
}
//----------------------------------------------//
//--|vaciar_inventario_usando_el_localstorage|--//
//----------------------------------------------//
vaciar_inventario.addEventListener(
    "click",
    function() {
        if (productos.length === 0) {
            alert("El inventario ya está vacío.");
            return;
        }
        const confirmar = confirm("¿Deseas eliminar todos los productos?");
        if (!confirmar) {
            return;
        }
        productos = [];
        localStorage.removeItem("productos_almacen");
        mostrar_productos();
    }
);
mostrar_productos();