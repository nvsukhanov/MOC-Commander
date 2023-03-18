import { Routes, UrlTree } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { MainComponent } from './main';
import { inject } from '@angular/core';
import { BluetoothAvailabilityGuardService } from './bluetooth-availability-guard.service';
import { Observable } from 'rxjs';

export const CONFIGURE_CONTROLLER_ROUTE = 'configure-controller';
export const CONFIGURE_HUB_ROUTE = 'configure-hub';

export const ROUTES: Routes = [
    { path: '', component: MainComponent, pathMatch: 'full' },
    {
        path: CONFIGURE_CONTROLLER_ROUTE,
        loadComponent: () => import('./configure-controller').then((mod) => mod.ConfigureControllerComponent),
        canActivate: [
            (): Observable<boolean | UrlTree> => inject(BluetoothAvailabilityGuardService).guard$
        ]
    },
    {
        path: CONFIGURE_HUB_ROUTE,
        loadComponent: () => import('./configure-hub').then((mod) => mod.ConfigureHubComponent),
        canActivate: [
            (): Observable<boolean | UrlTree> => inject(BluetoothAvailabilityGuardService).guard$
        ]
    },
    { path: '**', component: NotFoundComponent }
];
