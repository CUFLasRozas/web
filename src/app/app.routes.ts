import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: '', loadComponent: () => import('./components/paginas/inicio/inicio.component').then(m => m.InicioComponent)},
    {path: 'inicio', loadComponent: () => import('./components/paginas/inicio/inicio.component').then(m => m.InicioComponent)},
    {path: 'galeria', loadComponent: () => import('./components/paginas/galeria/galeria.component').then(m => m.GaleriaComponent)},
    {path: 'contacto', loadComponent: () => import('./components/paginas/contacto/contacto/contacto.component').then(m => m.ContactoComponent)},
    {path: 'entrenamientos', loadComponent: () => import('./components/paginas/entrenamientos/entrenamientos.component').then(m => m.EntrenamientosComponent)},
    {path: 'tienda', loadComponent: () => import('./components/paginas/tienda/tienda.component').then(m => m.TiendaComponent)},
    {path: 'historia', loadComponent: () => import('./components/paginas/historia/historia.component').then(m => m.HistoriaComponent)},
    {path: 'inscripcion', loadComponent: () => import('./components/paginas/inscripcion/inscripcion.component').then(m => m.InscripcionComponent)},
    {path: 'promociones', loadComponent: () => import('./components/paginas/promos/promos.component').then(m => m.PromosComponent)},
    {path: '**', loadComponent: () => import('./components/paginas/not-found/not-found.component').then(m => m.NotFoundComponent)},
];
