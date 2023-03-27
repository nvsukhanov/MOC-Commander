import { Routes, UrlTree } from '@angular/router';
import { EmptyViewComponent, NotFoundComponent } from './main';
import { importProvidersFrom, inject } from '@angular/core';
import { BluetoothAvailabilityGuardService } from './bluetooth-availability';
import { Observable } from 'rxjs';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { CONFIGURE_CONTROLLER_I18N_SCOPE, CONFIGURE_HUB_I18N_SCOPE, GAMEPAD_PLUGINS_I18N_SCOPE } from './i18n';

export const CONFIGURE_CONTROLLER_ROUTE = 'configure-controller';
export const CONFIGURE_HUB_ROUTE = 'configure-hub';

export const ROUTES: Routes = [
    {
        path: '',
        component: EmptyViewComponent,
        pathMatch: 'full',
    },
    {
        path: CONFIGURE_CONTROLLER_ROUTE,
        loadComponent: () => import('./configure-controller').then((mod) => mod.ConfigureControllerComponent),
        canActivate: [
            (): Observable<boolean | UrlTree> => inject(BluetoothAvailabilityGuardService).guard$
        ],
        providers: [
            importProvidersFrom(TranslocoModule),
            { provide: TRANSLOCO_SCOPE, useValue: CONFIGURE_CONTROLLER_I18N_SCOPE, multi: true },
            { provide: TRANSLOCO_SCOPE, useValue: GAMEPAD_PLUGINS_I18N_SCOPE, multi: true },
        ]
    },
    {
        path: CONFIGURE_HUB_ROUTE,
        loadComponent: () => import('./configure-hub').then((mod) => mod.ConfigureHubComponent),
        canActivate: [
            (): Observable<boolean | UrlTree> => inject(BluetoothAvailabilityGuardService).guard$
        ],
        providers: [
            { provide: TRANSLOCO_SCOPE, useValue: CONFIGURE_HUB_I18N_SCOPE },
        ]
    },
    {
        path: '**',
        component: NotFoundComponent,
    }
];
