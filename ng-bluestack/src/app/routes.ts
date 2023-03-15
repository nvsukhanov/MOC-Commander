import { Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { MainComponent } from './main';

export const CONNECT_CONTROLLER_ROUTE = 'configure-controller'

export const ROUTES: Routes = [
    { path: '', component: MainComponent, pathMatch: 'full' },
    {
        path: CONNECT_CONTROLLER_ROUTE,
        loadComponent: () => import('./configure-controller').then((mod) => mod.ConfigureControllerComponent),
    },
    { path: '**', component: NotFoundComponent }
];
