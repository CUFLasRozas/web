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

interface Senderismo {
    anual: {
        familiar: number;
        general: number;
    };
    diario: {
        socio: number;
        noSocio: number;
    };
    seguroNoSocio: number;
}

// Interfaz principal que representa el JSON completo
export interface PreciosTemporada {
    temporada: string;
    tarifas: TarifaCategoria[];
    instalaciones: number;
    senderismo: Senderismo;
}