import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'cuflr-visor-salida',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './visor-salida.component.html',
  styleUrl: './visor-salida.component.css'
})
export class VisorSalidaComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);

  htmlContenido!: SafeHtml;

  ngOnInit() {
    // Escuchamos el parámetro '?archivo=' de la URL
    this.route.queryParams.subscribe(params => {
      const nombreCarpeta = params['archivo'];

      if (nombreCarpeta) {
        // Construimos la ruta apuntando a tu estructura real en public/assets/
        const urlFisica = `/assets/salidas/${nombreCarpeta}/${nombreCarpeta}.html`;

       this.http.get(urlFisica, { responseType: 'text' }).subscribe({
      next: (htmlRaw) => {
        this.htmlContenido = this.sanitizer.bypassSecurityTrustHtml(htmlRaw);
      },
      error: () => {
        this.htmlContenido = this.sanitizer.bypassSecurityTrustHtml('<h2>Excursión no encontrada</h2>');
      }
    });
      }
    });
  }
}
