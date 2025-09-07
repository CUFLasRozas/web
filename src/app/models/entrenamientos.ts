export interface Entrenamientos {
    title:   string;
    listadoEntrenos: EntrenoEquipo[];
}

export interface EntrenoEquipo {
    equipo:         string;
    textoDiasHoras: string;
}