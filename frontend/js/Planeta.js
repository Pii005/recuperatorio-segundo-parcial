import { planetaBase } from "./PlanetaBase.js";


class Planeta extends planetaBase{
    constructor(nombre,tamano,masa,tipo,distanciaAlSol,presenciaVida,poseeAnillo,composicionAtmosferica) {
        super(nombre,tamano,masa,tipo)
        this.distanciaAlSol = distanciaAlSol;
        this.presenciaVida = presenciaVida;
        this.poseeAnillo = poseeAnillo;
        this.composicionAtmosferica = composicionAtmosferica;
    }
}
export { Planeta };




