import { Routes } from '@angular/router';
import { InicioComponent } from './components/paginas/inicio/inicio.component';
import { FotosComponent } from './components/paginas/fotos/fotos.component';
import { NotFoundComponent } from './components/paginas/not-found/not-found.component';
import { ContactoComponent } from './components/paginas/contacto/contacto/contacto.component';
import { EntrenamientosComponent } from './components/paginas/entrenamientos/entrenamientos.component';
import { TiendaComponent } from './components/paginas/tienda/tienda.component';
import { HistoriaComponent } from './components/paginas/historia/historia.component';
import { InscripcionComponent } from './components/paginas/inscripcion/inscripcion.component';

export const routes: Routes = [
    {path: '', component: InicioComponent},
    {path: 'inicio', component: InicioComponent},
    {path: 'fotos', component: FotosComponent},
    {path: 'contacto', component: ContactoComponent},
    {path: 'entrenamientos', component: EntrenamientosComponent},
    {path: 'tienda', component: TiendaComponent},
    {path: 'historia', component: HistoriaComponent},
    {path: 'inscripcion', component: InscripcionComponent},
    {path: '**', component: NotFoundComponent},
];
