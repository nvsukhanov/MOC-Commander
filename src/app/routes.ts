import { Routes } from '@angular/router';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { HUB_IO_I18N_SCOPE } from './i18n';
import { NotFoundComponent } from './common';

export const ROUTE_PATHS = {
    controllerList: 'controllers',
    hubList: 'hubs',
    controlSchemeList: 'control-schemes',
    hub: 'hub',
    hubEditSubroute: 'edit',
    controlScheme: 'control-scheme',
    controlSchemeCreateSubroute: 'create',
    controlSchemeEditSubroute: 'edit',
    about: 'about',
    bluetoothUnavailable: 'bluetooth-unavailable',
} as const;

export const ROUTES: Routes = [
    {
        path: '',
        redirectTo: ROUTE_PATHS.controllerList,
        pathMatch: 'full',
    },
    {
        path: ROUTE_PATHS.bluetoothUnavailable,
        loadComponent: () => import('./bluetooth-unavailable').then(m => m.BluetoothUnavailableComponent),
        pathMatch: 'full',
    },
    {
        path: ROUTE_PATHS.controllerList,
        loadComponent: () => import('./controllers/controllers-list').then(m => m.ControllersListComponent),
        pathMatch: 'full',
    },
    {
        path: ROUTE_PATHS.hubList,
        loadComponent: () => import('./hubs/hubs-list').then(m => m.HubsListComponent),
        pathMatch: 'full',
    },
    {
        path: ROUTE_PATHS.controlSchemeList,
        loadComponent: () => import('./control-schemes/control-scheme-list').then(m => m.ControlSchemeListComponent),
        pathMatch: 'full',
    },
    {
        path: ROUTE_PATHS.about,
        loadComponent: () => import('./about').then(m => m.AboutComponent),
        pathMatch: 'full',
    },
    {
        path: [ ROUTE_PATHS.hub, ':id' ].join('/'),
        loadComponent: () => import('./hubs/hub-view').then(m => m.HubViewComponent),
        pathMatch: 'full',
        providers: [
            { provide: TRANSLOCO_SCOPE, useValue: HUB_IO_I18N_SCOPE, multi: true },
        ]
    },
    {
        path: [ ROUTE_PATHS.hub, ':id', ROUTE_PATHS.hubEditSubroute ].join('/'),
        loadComponent: () => import('./hubs/hub-edit').then(m => m.HubEditComponent),
        pathMatch: 'full',
        providers: [
            { provide: TRANSLOCO_SCOPE, useValue: HUB_IO_I18N_SCOPE, multi: true },
        ]
    },
    {
        path: [ ROUTE_PATHS.controlScheme, ROUTE_PATHS.controlSchemeCreateSubroute ].join('/'),
        loadComponent: () => import('./control-schemes/create').then(m => m.ControlSchemeCreateComponent),
        pathMatch: 'full',
    },
    {
        path: [ ROUTE_PATHS.controlScheme, ':id' ].join('/'),
        loadComponent: () => import('./control-schemes/view').then(m => m.ControlSchemeViewComponent),
        pathMatch: 'full',
    },
    {
        path: [ ROUTE_PATHS.controlScheme, ':id', ROUTE_PATHS.controlSchemeEditSubroute ].join('/'),
        loadComponent: () => import('./control-schemes/edit').then(m => m.ControlSchemeEditComponent),
        pathMatch: 'full'
    },
    {
        path: '**',
        component: NotFoundComponent,
    }
];
