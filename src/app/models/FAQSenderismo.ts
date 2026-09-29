
export interface FAQSenderismo {
    titulo:   string;
    preguntas: Pregunta[];
}

export interface Pregunta {
    pregunta:  string;
    respuesta: string;
}