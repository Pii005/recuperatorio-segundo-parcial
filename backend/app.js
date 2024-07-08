const cors = require('cors'); // Importa el paquete cors
const express = require('express');
const app = express();
const port = 3000;

app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json());

let autos = [
    { id: 1, titulo: 'Ford Fiesta', transaccion: 'Venta', descripcion: 'Auto en buen estado', precio : 15000, cantidadKilometros: 80000, cantidadPuertas: 5, potencia: 120 },
    {
        id: 2,
        titulo: 'Chevrolet Cruze',
        transaccion: 'Alquiler',
        descripcion: 'Auto familiar',
        precio: 20000,
        cantidadKilometros: 60000,
        cantidadPuertas: 4,
        potencia: 140
    },
    {
        id: 3,
        titulo: 'Toyota Corolla',
        transaccion: 'Venta',
        descripcion: 'Auto con poco uso',
        precio: 22000,
        cantidadKilometros: 30000,
        cantidadPuertas: 4,
        potencia: 130
    }
];

// Middleware para simular una demora de 3 segundos
const simulateDelay = (req, res, next) => {
    setTimeout(next, 2500);
};

/**
 * Obtiene todos los Planetas
 */
app.get('/autos', simulateDelay, (req, res) => {
    res.json(autos);
});

/**
 * Crea un nuevo Planeta
 */
app.post('/autos', simulateDelay, (req, res) => {
    const { titulo, transaccion, descripcion, precio, cantidadKilometros, cantidadPuertas, potencia } = req.body;
    const nuevoPlaneta = {
        id: autos.length + 1,
        titulo,
        transaccion,
        descripcion,
        precio,
        cantidadKilometros,
        cantidadPuertas,
        potencia
    };
    autos.push(nuevoPlaneta);
    res.status(200).json(nuevoPlaneta);
});
/**
 * Obtiene Planeta por ID
 */
app.get('/autos/:id', simulateDelay, (req, res) => {
    const id = parseInt(req.params.id);
    const planeta = autos.find(p => p.id === id);
    if (planeta) {
        res.json(planeta);
    } else {
        res.status(404).send('Planeta no encontrado');
    }
});

/**
 * Edita Planeta por ID
 */
app.put('/autos/:id', simulateDelay, (req, res) => {
    const id = parseInt(req.params.id);
    const index = autos.findIndex(p => p.id === id);
    if (index !== -1) {
        const { titulo, transaccion, descripcion, precio, cantidadKilometros, cantidadPuertas, potencia } = req.body;
        const updatedPlaneta = {
            id,
            titulo,
            transaccion,
            descripcion,
            precio,
            cantidadKilometros,
            cantidadPuertas,
            potencia
        };
        autos[index] = updatedPlaneta;
        res.json(updatedPlaneta);
    } else {
        res.status(404).send('Planeta no encontrado');
    }
});

/**
 * Elimina Planeta por ID
 */
app.delete('/autos/:id', simulateDelay, (req, res) => {
    const id = parseInt(req.params.id);
    const index = autos.findIndex(p => p.id === id);
    if (index !== -1) {
        autos.splice(index, 1);
        res.status(200).send();
    } else {
        res.status(404).send('Planeta no encontrado');
    }
});

/**
 * Elimina todos los Planetas
 */
app.delete('/autos', simulateDelay, (req, res) => {
    autos = [];
    res.status(200).send('Todos los autos han sido eliminados');
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});