import { Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { MainComponent } from './main';

export const CONFIGURE_CONTROLLER_ROUTE = 'configure-controller'
export const CONFIGURE_HUB_ROUTE = 'configure-hub';

export const ROUTES: Routes = [
    { path: '', component: MainComponent, pathMatch: 'full' },
    {
        path: CONFIGURE_CONTROLLER_ROUTE,
        loadComponent: () => import('./configure-controller').then((mod) => mod.ConfigureControllerComponent),
    },
    {
        path: CONFIGURE_HUB_ROUTE,
        loadComponent: () => import('./configure-hub').then((mod) => mod.ConfigureHubComponent)
    },
    { path: '**', component: NotFoundComponent }
];
