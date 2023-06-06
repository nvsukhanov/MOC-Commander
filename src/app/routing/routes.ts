import { Routes } from '@angular/router';

import { NotFoundComponent } from '../common';

export const ROUTE_PATHS = {
    controllers: 'controllers',
    hubs: 'hubs',
    controlSchemes: 'control-schemes',
    hubEdit: 'edit',
    controlSchemeCreate: 'create',
    controlSchemeEdit: 'edit',
    about: 'about',
    bluetoothUnavailable: 'bluetooth-unavailable',
} as const;

export const ROUTES: Routes = [
    {
        path: '',
        redirectTo: ROUTE_PATHS.controllers,
        pathMatch: 'full',
    },
    {
        path: ROUTE_PATHS.about,
        loadComponent: () => import('../about').then(m => m.AboutComponent),
        pathMatch: 'full',
    },
    {
        path: ROUTE_PATHS.bluetoothUnavailable,
        loadComponent: () => import('../bluetooth-unavailable').then(m => m.BluetoothUnavailableComponent),
        pathMatch: 'full',
    },
    {
        path: ROUTE_PATHS.controllers,
        loadComponent: () => import('../controllers/controllers-list').then(m => m.ControllersListComponent),
        pathMatch: 'full'
    },
    {
        path: ROUTE_PATHS.hubs,
        children: [
            {
                path: '',
                loadComponent: () => import('../hubs/hubs-list').then(m => m.HubsListComponent),
                pathMatch: 'full',
            },
            {
                path: [ ':id' ].join('/'),
                loadComponent: () => import('../hubs/hub-view').then(m => m.HubViewComponent),
                pathMatch: 'full'
            },
            {
                path: [ ':id', ROUTE_PATHS.hubEdit ].join('/'),
                loadComponent: () => import('../hubs/hub-edit').then(m => m.HubEditComponent),
                pathMatch: 'full',
            },
        ]
    },
    {
        path: ROUTE_PATHS.controlSchemes,
        children: [
            {
                path: '',
                loadComponent: () => import('../control-schemes/control-scheme-list').then(m => m.ControlSchemeListComponent),
                pathMatch: 'full',
            },
            {
                path: [ ROUTE_PATHS.controlSchemeCreate ].join('/'),
                loadComponent: () => import('../control-schemes/create').then(m => m.ControlSchemeCreateComponent),
                pathMatch: 'full'
            },
            {
                path: [ ':id' ].join('/'),
                loadComponent: () => import('../control-schemes/view').then(m => m.ControlSchemeViewComponent),
                pathMatch: 'full',
            },
            {
                path: [ ':id', ROUTE_PATHS.controlSchemeEdit ].join('/'),
                loadComponent: () => import('../control-schemes/edit').then(m => m.ControlSchemeEditComponent),
                pathMatch: 'full'
            },
        ]
    },
    {
        path: '**',
        component: NotFoundComponent,
    }
];
