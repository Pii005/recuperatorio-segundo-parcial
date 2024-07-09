import {mostrarSpinner, ocultarSpinner} from "./spinner.js";
import {mostrarBotones, ocultarBotones} from "./botones.js";
import { GetAll, DeleteAll, CreateOne, UpdateById, DeleteById } from "./api.js";
import {AnuncioAuto} from "./anuncio_auto.js";

let items = [];
const formulario = document.getElementById("form-item");
let selectedItemIndex = null;

document.addEventListener("DOMContentLoaded", async () => {
    try {
        ocultarBotones();
        await actualizadorTabla();
        await eliminarTodo();
    // Edicion:
        await  crearUno(); 
        await back();
        await eliminarUno();
        await editarItem(); 
    // Filtrado
        await btnCancelar();
        await obtenerPromedio();
        await filtrarTabla();
    } catch (error) {
        console.error("Error during DOMContentLoaded event:", error);
    }
});


async function actualizadorTabla(e) {
    try {
        mostrarSpinner();
        limpiarTabla();
        let objetos = await GetAll();
        items = objetos.map(obj => new AnuncioAuto(
            obj.id,
            obj.titulo,
            obj.transaccion,
            obj.descripcion,
            obj.precio,
            obj.kms,
            obj.puertas,
            obj.potencia
        ));
        await rellenarTabla(items);
    } catch (error) {
        console.error("Error al actualizar tabla:", error);
        alert("Error al actualizar tabla: " + error.message);
    } finally {
        ocultarSpinner();
    }
}

async function limpiarTabla() {
    items.length = 0;
    const tabla = document.getElementById("table-items");
    if (!tabla) {
        console.warn("Elemento 'table-items' no encontrado en el DOM.");
        return;
    }

    const tbody = tabla.querySelector("tbody");
    if (tbody) {
        tbody.innerHTML = ""; 
    } else {
        console.warn("Elemento 'tbody' no encontrado en la tabla.");
    }
}


async function rellenarTabla(items) {
    const tabla = document.getElementById("table-items");
    let tbody = tabla.getElementsByTagName('tbody')[0];

    tbody.innerHTML = ''; 

    const celdas = [
        "id",
        "titulo",
        "transaccion",
        "descripcion",
        "precio",
        "kms",
        "puertas",
        "potencia"
    ];
    
    items.forEach((item, index) => {
        console.log(item);
        let nuevaFila = document.createElement("tr");
        nuevaFila.classList.add("table-row");

        celdas.forEach((celda) => {
        let nuevaCelda = document.createElement("td");
        nuevaCelda.textContent = item[celda];
        nuevaFila.appendChild(nuevaCelda);
        });

        addRowClickListener(nuevaFila, index); 

        tbody.appendChild(nuevaFila);
    });
}



async function actualizarFormulario() {
    formulario.reset();
    selectedItemIndex = null;
}



async function eliminarTodo() 
{
    const btn = document.getElementById("btn-delete-all");

    btn.addEventListener("click", async (e) => {
        const rta = confirm('¿Desea eliminar todos los Items?');

        if (rta) {
        try {
            await mostrarSpinner();
            await DeleteAll().then(promise =>
            {
                actualizarFormulario(); 
                actualizadorTabla();
            });
            ocultarBotones();
        } catch (error) {
            alert(error);
        } finally {
            ocultarSpinner();
        }
        }
    });
}

async function eliminarUno() {
    const btn = document.getElementById("btn-delete-one");
    btn.addEventListener('click', async () => {
        if (selectedItemIndex !== null) {
            const rta = confirm('¿Desea eliminar el item?');

            if (rta) {
                const item = items[selectedItemIndex]; // Obtener el item a eliminar
                items.splice(selectedItemIndex, 1); // Eliminar del array local
                console.log(item.id);
                mostrarSpinner();
                try {
                    console.log("Borrando: " + item.id);
                    await DeleteById(item.id).then(response =>{
                        actualizarFormulario(); 
                        actualizadorTabla();
                    }); // Eliminar del servidor
                    selectedItemIndex = null;
                } catch (error) {
                    console.log(error);
                    alert(error);
                } finally {
                    ocultarSpinner();
                    limpiarTabla();
                    ocultarBotones();
                }
            }
        } else {
            alert("No hay elemento seleccionado para eliminar.");
        }
    });
}


async function crearUno() {
    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();
        var fechaActual = new Date();

        const model = new AnuncioAuto(
            fechaActual.getTime(),
            formulario.querySelector("#titulo").value,
            getselect(), 
            formulario.querySelector("#descripcion").value,
            formulario.querySelector("#precio").value,
            formulario.querySelector("#kms").value, 
            formulario.querySelector("#puertas").value, 
            formulario.querySelector("#potencia").value
        );
        
        console.log(model); // Verifica en la consola si los valores se están obteniendo correctamente
        
        try {
            console.log("Creando...");
            await mostrarSpinner();
            await CreateOne(model).then(() => {
                actualizarFormulario(); 
                actualizadorTabla();
            });
        } catch (error) {
            alert("Error al crear auto: " + error.message);
        } finally {
            console.log("Auto creado");
            ocultarSpinner();
        }
    });
}


function getselect() { // CHECKBOX
    const radios = document.getElementsByName("transaccion");
    
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return radios[i].value;
        }
    }
    
    return "";
}


function addRowClickListener(row, index) {
    row.addEventListener('click', () => {
        const cells = row.querySelectorAll('td');
        const rowData = Array.from(cells).map(cell => cell.textContent);
        selectedItemIndex = index;
        inicirEdicion(rowData); 
    });

}


async function inicirEdicion(auto) {
    console.log(auto[0]);
    console.log(auto[1]);
    console.log(auto);
    formulario.querySelector("#titulo").value = auto[1];
    // formulario.querySelector("#transaccion").value = auto[2];
    formulario.querySelector("#descripcion").value = auto[3];
    formulario.querySelector("#precio").value = auto[4];
    formulario.querySelector("#kms").value = auto[5];
    formulario.querySelector("#puertas").value = auto[6];
    formulario.querySelector("#potencia").value = auto[7];



    if (auto[2] === "venta") {
        formulario.querySelector("#rventa").checked = true;
    }  else {
        formulario.querySelector("#rAlquiler").checked = true;
    }

    mostrarBotones();
}

async function back() {
    const btn = document.getElementById("btn-back");

    btn.addEventListener("click", async () => {
    const rta = confirm('¿Desea dejar de editar?');

    if (rta) {
        try {
            console.log("Volviendo atras...");
            await mostrarSpinner();
            await actualizarFormulario();
            await ocultarBotones(); 
        } catch (error) {
            alert(error);
        } finally {
            console.log("Listo!!");
            ocultarSpinner();
        }
    }
    });
}


async function editarItem() {
    const btn = document.getElementById("btn-edit");
    btn.addEventListener('click', async () =>{
        if (selectedItemIndex === null) return;
    
        const item = items[selectedItemIndex]; // Obtener el item a editar
        // var fechaActual = new Date();

        const model = new AnuncioAuto(
            item.id,
            formulario.querySelector("#titulo").value,
            getselect(), 
            formulario.querySelector("#descripcion").value,
            formulario.querySelector("#precio").value,
            formulario.querySelector("#kms").value, 
            formulario.querySelector("#puertas").value, 
            formulario.querySelector("#potencia").value
        );
        console.log(formulario.querySelector("#kms").value);
        // const respuesta = true;
        console.log(item.kms);
        
        mostrarSpinner();
        console.log("EDITANDO: " + item.id);
        try {
            await UpdateById(item.id, model); // Editar en el servidor
            // await loadItems(); // Volver a cargar los items y actualizar la tabla
            await actualizarFormulario();
            await actualizadorTabla();
            await ocultarBotones(); // Ocultar botones de edición
            selectedItemIndex = null; // Resetear el índice seleccionado
        } catch (error) {
            alert(error);
            console.log(error);
        } finally {
            console.log("Listo");
            ocultarSpinner();
        }

    });
}

async function btnCancelar() {
    const btn = document.getElementById("cancelador");

    btn.addEventListener("click", async () => {
        mostrarSpinner();
        console.log("reiniciando...");
        await actualizadorTabla(); // Resetear el formulario
        await actualizarEncabezadoTabla();
        ocultarSpinner();
        console.log("listo!");
    });
}


async function obtenerPromedio() {
    const btn = document.getElementById("filtrador");

    btn.addEventListener("click", async (event) => {
        event.preventDefault(); // Evitar el comportamiento predeterminado del botón

        const selectElement = document.getElementById("filtro-text");
        const tipoSeleccionado = selectElement.value.toLowerCase();
    
        if (!tipoSeleccionado) {
            alert("Seleccione una transaccion para calcular el promedio.");
            return;
        }
    
        const tabla = document.getElementById("table-items");
        const filas = Array.from(tabla.querySelectorAll("tbody tr"));
    
        let suma = 0;
        let contador = 0;
    
        filas.forEach((fila) => {
            const celdas = fila.querySelectorAll("td");
            const tipo = celdas[2].textContent.toLowerCase(); // Ajusta el índice según la estructura de tu tabla
            console.log(celdas[2]);
            if (tipo === tipoSeleccionado) {
                const tamano = parseFloat(celdas[4].textContent); // Ajusta el índice según la estructura de tu tabla
                if (!isNaN(tamano)) {
                    suma += tamano;
                    contador++;
                }
            }
        });
    
        const promedio = contador > 0 ? suma / contador : 0;
        const promedioResult = document.getElementById("promedio-result");

        console.log(promedio);
        if (promedio != 0) {
            promedioResult.value = promedio.toFixed(2);
        } else {
            promedioResult.value = "N/A";
        }
    });
}


async function filtrarTabla() {
    const btn = document.getElementById("filtrar-Tabla");

    btn.addEventListener("click", async (e) => {
        let checkboxes = document.querySelectorAll('input[type="checkbox"]');
        
        let camposSeleccionados = [];

        checkboxes.forEach(function(checkbox) {
            if (checkbox.checked) {
                camposSeleccionados.push(checkbox.value); 
            }
        });

        console.log(camposSeleccionados);
        mostrarColumnasSeleccionadas(camposSeleccionados);
    });
}


function mostrarColumnasSeleccionadas(camposSeleccionados) {
    let table = document.getElementById("table-items");
    let header = table.querySelector("thead tr");
    
    let rows = table.querySelectorAll("tbody tr");
    
    header.querySelectorAll("th").forEach((th, index) => {
        let headerText = th.textContent.toLowerCase().trim();
        if (!camposSeleccionados.includes(headerText)) {
            th.style.display = "none";
        } else {
            th.style.display = "";
        }
    });


    rows.forEach((row) => {
        let cells = row.querySelectorAll("td");
        
        cells.forEach((cell, index) => {
            let headerText = header.querySelector(`th:nth-child(${index + 1})`).textContent.toLowerCase().trim();
            if (!camposSeleccionados.includes(headerText)) {
                cell.style.display = "none";
            } else {
                cell.style.display = "";
            }
        });
    });
}


async function actualizarEncabezadoTabla() {
    const tabla = document.getElementById("table-items");
    const header = tabla.querySelector("thead tr");

    header.innerHTML = `
        <th>ID</th>
        <th>titulo</th>
        <th>transaccion</th>
        <th>descripcion</th>
        <th>precio</th>
        <th>kms</th>
        <th>puertas</th>
        <th>potencia</th>
    `;
}
