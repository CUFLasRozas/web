export interface InfoClub {
    secciones: Secciones[];
}

export interface Secciones {
    title:           string;
    listadoMiembros: ListadoMiembro[];
}

export interface ListadoMiembro {
    nombre:  string;
    cargo:   string;
    urlfoto: string;
}