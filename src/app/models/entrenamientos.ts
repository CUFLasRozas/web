export interface Entrenamientos {
    title: string;
    listadoEntrenos: EntrenoEquipo[];
}

export interface EntrenoEquipo {
    equipo: string;
    dias: Dias[];
    camisetas: string[];
}

export interface Dias {
    dia: string;
    camiseta: string;
}