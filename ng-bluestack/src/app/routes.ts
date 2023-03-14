import { Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { MainComponent } from './main';

export const CONNECT_CONTROLLER_ROUTE = 'connect-controller'

export const ROUTES: Routes = [
    { path: '', component: MainComponent, pathMatch: 'full' },
    { path: CONNECT_CONTROLLER_ROUTE, loadComponent: () => import('./connect-controller').then((mod) => mod.ConnectControllerComponent) },
    { path: '**', component: NotFoundComponent }
];
