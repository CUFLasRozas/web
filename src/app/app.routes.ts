import { Routes } from '@angular/router';
import { InicioComponent } from './components/paginas/inicio/inicio.component';
import { GaleriaComponent } from './components/paginas/galeria/galeria.component';
import { NotFoundComponent } from './components/paginas/not-found/not-found.component';
import { ContactoComponent } from './components/paginas/contacto/contacto/contacto.component';
import { EntrenamientosComponent } from './components/paginas/entrenamientos/entrenamientos.component';
import { TiendaComponent } from './components/paginas/tienda/tienda.component';
import { HistoriaComponent } from './components/paginas/historia/historia.component';
import { InscripcionComponent } from './components/paginas/inscripcion/inscripcion.component';
import { PromosComponent } from './components/paginas/promos/promos.component';
import { SenderismoPpalComponent } from './components/paginas/senderismo/senderismo-ppal/senderismo-ppal.component';
import { HazteSocioComponent } from './components/paginas/senderismo/hazte-socio/hazte-socio.component';

export const routes: Routes = [
    { path: '', component: InicioComponent },
    { path: 'inicio', component: InicioComponent },
    { path: 'galeria', component: GaleriaComponent },
    { path: 'contacto', component: ContactoComponent },
    { path: 'entrenamientos', component: EntrenamientosComponent },
    { path: 'tienda', component: TiendaComponent },
    { path: 'historia', component: HistoriaComponent },
    { path: 'inscripcion', component: InscripcionComponent },
    { path: 'promociones', component: PromosComponent },
    {
        path: 'senderismo',
        children: [
            { path: '', component: SenderismoPpalComponent },
            { path: 'socio', component: HazteSocioComponent }
        ]
    },
    { path: '**', component: NotFoundComponent },
];
