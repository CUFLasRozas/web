interface DetalleTarifa {
    precio: number;
    ahorro: number;
}

// Define las opciones de pago disponibles
interface OpcionesPago {
    mensual: DetalleTarifa;
    anual: DetalleTarifa;
}

// Define el objeto de cada categoría deportiva
interface TarifaCategoria {
    id: string;
    categoria: string;
    opciones: OpcionesPago;
    seguroYtasas: number;

}

// Interfaz principal que representa el JSON completo
export interface PreciosTemporada {
    temporada: string;
    tarifas: TarifaCategoria[];
    instalaciones: number;
}