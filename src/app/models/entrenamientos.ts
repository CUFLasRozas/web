export interface Entrenamientos {
    title: string;
    listadoEntrenos: EntrenoEquipo[];
}

export interface EntrenoEquipo {
    equipo: string;
    dias: string[];
}