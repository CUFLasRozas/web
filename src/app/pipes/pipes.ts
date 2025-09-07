import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'miJson', // Nombre del pipe
    standalone: true
  })
  export class MiJsonPipe implements PipeTransform {
    transform(value: any, espacios: number = 2): string {
      return JSON.stringify(value, null, espacios);
    }
  }