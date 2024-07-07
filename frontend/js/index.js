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
        await eliminarUno();
        await editarItem();
        await obtenerPromedio();
        await filtrarTabla();
        await btnCancelar();
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
            obj.id,
            obj.nombre,
            obj.tamano,
            obj.masa,
            obj.tipo,
            obj.distanciaAlSol,
            obj.presenciaVida,
            obj.poseeAnillo,
            obj.composicionAtmosferica
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
        tbody.innerHTML = ""; // Limpiar solo el contenido de tbody
    } else {
        console.warn("Elemento 'tbody' no encontrado en la tabla.");
    }
}


// addRowClickListener(nuevaFila, index); // Asignar el listener a la fila con el índice correcto
async function rellenarTabla(items) {
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
            mostrarSpinner();
            await DeleteAll().then(promise =>
            {
                actualizarFormulario(); 
                actualizadorTabla();
            });
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
        var fechaActual = new Date();

        const model = new Planeta(
            fechaActual.getTime(),
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
                await CreateOne(model).then(promise =>
                {
                    actualizarFormulario(); 
                    actualizadorTabla();
                });
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
        selectedItemIndex = index;
        inicirEdicion(rowData); 
    });

}

async function inicirEdicion(planeta) {
    console.log(planeta[0]);
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

async function editarItem() {
    const btn = document.getElementById("btn-edit");
    btn.addEventListener('click', async () =>{
        if (selectedItemIndex === null) return;
    
        const item = items[selectedItemIndex]; // Obtener el item a editar
        // var fechaActual = new Date();

        const model = new Planeta(
        item.id,
        formulario.querySelector("#Nombre").value,
        formulario.querySelector("#Tamaño").value,
        formulario.querySelector("#Masa").value,
        getselect(), // Obtener valor de select
        formulario.querySelector("#Distancia").value,
        obtenerValorCheckBot('pvida'),
        obtenerValorCheckBot('panillo'), // Obtener valor de radio
        formulario.querySelector("#composicion").value
        );
        
        // const respuesta = true;
    
        
        mostrarSpinner();
        console.log("EDITANDO");
        try {
            await UpdateById(item.id, model); // Editar en el servidor
            // await loadItems(); // Volver a cargar los items y actualizar la tabla
            await actualizarFormulario();
            await actualizadorTabla();
            ocultarBotones(); // Ocultar botones de edición
            selectedItemIndex = null; // Resetear el índice seleccionado
        } catch (error) {
            alert(error);
            console.log(error);
        } finally {
            ocultarSpinner();
        }

    });
}

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


// PROMEDIO Y FILTRAR TABLA:
async function obtenerPromedio() {
    const btn = document.getElementById("filtrador");

    btn.addEventListener("click", async (event) => {
        event.preventDefault(); // Evitar el comportamiento predeterminado del botón

        const selectElement = document.getElementById("filtro-text");
        const tipoSeleccionado = selectElement.value.toLowerCase();
    
        if (!tipoSeleccionado) {
            alert("Seleccione un tipo para calcular el promedio.");
            return;
        }
    
        const tabla = document.getElementById("table-items");
        const filas = Array.from(tabla.querySelectorAll("tbody tr"));
    
        let suma = 0;
        let contador = 0;
    
        filas.forEach((fila) => {
            const celdas = fila.querySelectorAll("td");
            const tipo = celdas[4].textContent.toLowerCase(); // Ajusta el índice según la estructura de tu tabla
    
            if (tipo === tipoSeleccionado) {
                const tamano = parseFloat(celdas[5].textContent); // Ajusta el índice según la estructura de tu tabla
                if (!isNaN(tamano)) {
                    suma += tamano;
                    contador++;
                }
            }
        });
    
        const promedio = contador > 0 ? suma / contador : 0;
        const promedioResult = document.getElementById("promedio-result");
    
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
        // Obtener todos los checkboxes
        let checkboxes = document.querySelectorAll('input[type="checkbox"]');
        
        // Variables para almacenar los campos seleccionados
        let camposSeleccionados = [];

        // Iterar sobre cada checkbox y verificar si está seleccionado
        checkboxes.forEach(function(checkbox) {
            if (checkbox.checked) {
                camposSeleccionados.push(checkbox.value); // Agregar el valor del checkbox seleccionado al array
            }
        });

        // Mostrar solo las columnas seleccionadas en la tabla
        console.log(camposSeleccionados);
        mostrarColumnasSeleccionadas(camposSeleccionados);
    });
}

function mostrarColumnasSeleccionadas(camposSeleccionados) {
    // Obtener la tabla y su cabecera
    let table = document.getElementById("table-items");
    let header = table.querySelector("thead tr");
    
    // Obtener todas las filas de datos
    let rows = table.querySelectorAll("tbody tr");
    
    // Mostrar/ocultar cabeceras
    header.querySelectorAll("th").forEach((th, index) => {
        let headerText = th.textContent.toLowerCase().trim();
        // Sconsole.log(headerText);
        if (!camposSeleccionados.includes(headerText)) {
            th.style.display = "none";
        } else {
            th.style.display = "";
        }
    });

    // Iterar sobre las filas y mostrar solo las columnas seleccionadas
    rows.forEach((row) => {
        let cells = row.querySelectorAll("td");
        
        cells.forEach((cell, index) => {
            let headerText = header.querySelector(`th:nth-child(${index + 1})`).textContent.toLowerCase().trim();
            if (!camposSeleccionados.includes(headerText)) {
                cell.style.display = "none";
            } else {
                cell.style.display = ""; // Mostrar celda si está en los campos seleccionados
            }
        });
    });
}

async function actualizarEncabezadoTabla() {
    const tabla = document.getElementById("table-items");
    const header = tabla.querySelector("thead tr");

    // Aquí actualizas el encabezado según tus necesidades
    // Por ejemplo, puedes redefinir el innerHTML del header según las columnas que desees mostrar
    header.innerHTML = `
        <th>ID</th>
        <th>Nombre</th>
        <th>Tamaño</th>
        <th>Masa</th>
        <th>Tipo</th>
        <th>Distancia al Sol</th>
        <th>Presencia de Vida</th>
        <th>Posee Anillo</th>
        <th>Composición Atmosférica</th>
    `;
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



