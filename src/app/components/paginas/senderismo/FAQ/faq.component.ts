import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UtilesService } from '../../../../service/utiles/utiles.service';
import { FAQSenderismo } from '../../../../models/FAQSenderismo';

@Component({
  selector: 'cuflr-faq',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FAQComponent {
  listadoFAQ: FAQSenderismo[] = [];
  
     constructor(
        private ultilesService: UtilesService
      ) { }
  
      ngOnInit() {  
     this.ultilesService.obtenerJson('FAQSenderismo.json').subscribe((data: any) => {
        this.listadoFAQ = data;
      })
    }

}
