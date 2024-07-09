import {Anuncio} from "./anuncio.js";

export class AnuncioAuto extends Anuncio {
    constructor(id, titulo, transaccion, descripcion, precio, 
        kms, puertas, potencia) {


        super(id, titulo, transaccion, descripcion, precio);
        this.puertas = puertas;
        this.kms = kms;
        this.potencia = potencia;
    }
}