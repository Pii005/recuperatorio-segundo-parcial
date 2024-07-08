import {Anuncio} from "./anuncio.js";

export class AnuncioAuto extends Anuncio {
    constructor(id, titulo, transaccion, descripcion, precio, 
        cantidadKilometros, cantidadPuertas, potencia) {

            
        super(id, titulo, transaccion, descripcion, precio);
        this.cantidadPuertas = cantidadPuertas;
        this.cantidadKilometros = cantidadKilometros;
        this.potencia = potencia;
    }
}