export interface ObjetosTienda {
    rutaTienda: string
    listaObjetos: ListaObjeto[]
  }
  
  export interface ListaObjeto {
    carpeta: string
    imagenPpal: string
    nombrePpal: string
    precio: number
    colores: string[]
    ObjetosIndividual: ObjetoIndividual[]
  }
  
  export interface ObjetoIndividual {
    img: string[]
    nombre: string
    precio: number
    color: string
  }
  