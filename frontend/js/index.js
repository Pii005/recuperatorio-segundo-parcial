import { Planeta } from "./Planeta.js";
import { mostrarSpinner, ocultarSpinner } from "./spinner.js";
import { GetAll, DeleteAll, CreateOne, UpdateById, DeleteById } from "./api.js";
import { mostrarBotones, ocultarBotones } from "./botones.js";

let items = [];
const formulario = document.getElementById("form-item");
let selectedItemIndex = null;

document.addEventListener("DOMContentLoaded", async () => {
    try {
        ocultarBotones();
        await actualizadorTabla();
        await eliminarTodo(); 
        await crearUno();
        await back();
    } catch (error) {
        console.error("Error during DOMContentLoaded event:", error);
    }
});


async function actualizadorTabla(e) {
    try {
        mostrarSpinner();
        limpiarTabla();
        let objetos = await GetAll();
        items = objetos.map(obj => new Planeta(
            obj.nombre,
            obj.tamano,
            obj.masa,
            obj.tipo,
            obj.distanciaAlSol,
            obj.presenciaVida,
            obj.poseeAnillo,
            obj.composicionAtmosferica
        ));
        rellenarTabla(items);
    } catch (error) {
        console.error("Error al actualizar tabla:", error);
        alert("Error al actualizar tabla: " + error.message);
    } finally {
        ocultarSpinner();
    }
}

function limpiarTabla() {
    items.length = 0;
    const tabla = document.getElementById("table-items");
    if (!tabla) {
        console.warn("Elemento 'table-items' no encontrado en el DOM.");
        return;
    }

    const tbody = tabla.querySelector("tbody");
    if (tbody) {
        tbody.innerHTML = ""; // Limpiar solo el contenido de tbody
    } else {
        console.warn("Elemento 'tbody' no encontrado en la tabla.");
    }
}

function actualizarPagina() {
    location.reload();
}

// addRowClickListener(nuevaFila, index); // Asignar el listener a la fila con el índice correcto
function rellenarTabla(items) {
    const tabla = document.getElementById("table-items");
    let tbody = tabla.getElementsByTagName('tbody')[0];

    tbody.innerHTML = ''; // Me aseguro que esté vacío, hago referencia al agregar otro

    const celdas = ["id", "nombre", "tamano", "masa", "tipo", "distanciaAlSol", 
        "presenciaVida", "poseeAnillo", "composicionAtmosferica"];
    
    items.forEach((item, index) => {
        let nuevaFila = document.createElement("tr");
        nuevaFila.classList.add("table-row");

        celdas.forEach((celda) => {
        let nuevaCelda = document.createElement("td");
        nuevaCelda.textContent = item[celda];
        nuevaFila.appendChild(nuevaCelda);
        });

        addRowClickListener(nuevaFila, index); // Asignar el listener a la fila con el índice correcto

        // Agregar la fila al tbody
        tbody.appendChild(nuevaFila);
    });
}



function actualizarFormulario() {
    formulario.reset();
}

async function eliminarTodo() 
{
    const btn = document.getElementById("btn-delete-all");

    btn.addEventListener("click", async (e) => {
        const rta = confirm('¿Desea eliminar todos los Items?');

        if (rta) {
        try {
            mostrarSpinner();
            await DeleteAll();
            items.splice(0, items.length); // Limpiar el array local
            limpiarTabla(); // Volver a cargar los items y actualizar la tabla
            actualizarFormulario();
        } catch (error) {
            alert(error);
        } finally {
            ocultarSpinner();
        }
        }
    });
}

async function crearUno() {
    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const model = new Planeta(
            formulario.querySelector("#Nombre").value,
            formulario.querySelector("#Tamaño").value,
            formulario.querySelector("#Masa").value,
            getselect(), // Obtener valor de select
            formulario.querySelector("#Distancia").value,
            obtenerValorCheckBot('pvida'),
            obtenerValorCheckBot('panillo'), // Obtener valor de radio
            formulario.querySelector("#composicion").value,
            );
        
            console.log(model);
            const respuesta = true;
        
            mostrarSpinner();
            if (respuesta) {
            try {
                await CreateOne(model);
                actualizarFormulario(); 
                actualizadorTabla();
                //limpiarTabla();
            } catch (error) {
                alert(error);
            } finally {
                ocultarSpinner();
            }
            } else {
            alert(respuesta.rta);
            }
        });
}

function getselect()// OPCIONES **********
{
  const selectElement = document.getElementById('tipo'); // Obtener el elemento select por su ID
    const selectedOption = selectElement.querySelector('option:checked').value;

    console.log("TIpo: " + selectedOption); 
    return selectedOption;
}

function obtenerValorCheckBot(id) { // CHECKBOX
    const checkbox = document.getElementById(id);
    
    if (checkbox.checked) {
        return checkbox.value;
    } else {
        return "false";
    }
}

function addRowClickListener(row, index) {
    row.addEventListener('click', () => {
    const cells = row.querySelectorAll('td');
    const rowData = Array.from(cells).map(cell => cell.textContent);
    console.log(rowData);
    inicirEdicion(rowData); 
    });
}



async function inicirEdicion(planeta) {
    formulario.querySelector("#Nombre").value = planeta[1];
    formulario.querySelector("#Tamaño").value = planeta[2];
    formulario.querySelector("#Masa").value = planeta[3];
    formulario.querySelector("#tipo").value = planeta[4];
    formulario.querySelector("#Distancia").value = planeta[5];

    if (planeta[6] === "true") {
        formulario.querySelector("#pvida").checked = true;
    }  else {
        formulario.querySelector("#pvida").checked = false;
    }

    if (planeta[7] === "true") {
        formulario.querySelector("#panillo").checked = true;
    } else {
        formulario.querySelector("#panillo").checked = false;
    }

    formulario.querySelector("#composicion").value = planeta[8];

    mostrarBotones();
}

async function editarItem() {}

async function borrarFormulario() {}

async function back() {
    const btn = document.getElementById("btn-back");

    btn.addEventListener("click", async () => {
    const rta = confirm('¿Desea dejar de editar?');

    if (rta) {
        try {
            mostrarSpinner();
            actualizarFormulario();
            ocultarBotones(); // Ocultar botones al dejar de editar
        } catch (error) {
            alert(error);
        } finally {
            ocultarSpinner();
        }
    }
    });
}

async function elimirUno() {
    
}
