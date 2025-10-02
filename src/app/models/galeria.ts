export interface ControlGaleria {
    mostrarAnyo: string,
    filtroActived: boolean,
    temporadas: Temporada[]
}

export interface Temporada {
    value: string,
    literal: string
}


export interface Imagenes {
    url: String,
    navigateTo: String,
    alt: String,
    categoria: String,
    equipo: String,
    pie: String
}