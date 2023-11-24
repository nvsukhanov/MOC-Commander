import { Routes } from '@angular/router';
import { ROUTE_SECTIONS } from '@app/shared';

import { NotFoundPageComponent } from './not-found-page';

export const ROUTES: Routes = [
    {
        path: '',
        redirectTo: ROUTE_SECTIONS.controllers,
        pathMatch: 'full',
    },
    {
        path: ROUTE_SECTIONS.about,
        loadComponent: () => import('./about-page').then(m => m.AboutPageComponent),
        pathMatch: 'full',
    },
    {
        path: ROUTE_SECTIONS.bluetoothUnavailable,
        loadComponent: () => import('./bluetooth-unavailable-page').then(m => m.BluetoothUnavailablePageComponent),
        pathMatch: 'full',
    },
    {
        path: ROUTE_SECTIONS.controllers,
        children: [
            {
                path: '',
                loadComponent: () => import('./controllers/controllers-list-page').then(m => m.ControllersListPageComponent),
                pathMatch: 'full'
            },
            {
                path: [ ':id' ].join('/'),
                loadComponent: () => import('./controllers/controller-page').then(m => m.ControllerPageComponent),
                pathMatch: 'full'
            }
        ]
    },
    {
        path: ROUTE_SECTIONS.hubs,
        children: [
            {
                path: '',
                loadComponent: () => import('./hubs/hubs-list-page').then(m => m.HubsListPageComponent),
                pathMatch: 'full',
            },
            {
                path: [ ':id' ].join('/'),
                loadComponent: () => import('./hubs/hub-view-page').then(m => m.HubViewPageComponent),
                pathMatch: 'full'
            },
            {
                path: [ ':id', ROUTE_SECTIONS.hubEdit ].join('/'),
                loadComponent: () => import('./hubs/hub-edit-page').then(m => m.HubEditPageComponent),
                pathMatch: 'full',
            }
        ]
    },
    {
        path: ROUTE_SECTIONS.controlSchemes,
        children: [
            {
                path: '',
                loadComponent: () => import('./control-schemes/control-scheme-list-page').then((m) => m.ControlSchemeListPageComponent),
                pathMatch: 'full',
            },
            {
                path: [ ':schemeName' ].join('/'),
                loadComponent: () => import('./control-schemes/control-scheme-page').then((m) => m.ControlSchemePageComponent),
                pathMatch: 'full',
            },
            {
                path: [ ':schemeName', ROUTE_SECTIONS.binding, ':bindingId' ].join('/'),
                loadComponent: () => import('./control-schemes/binding-edit-page').then((m) => m.BindingEditPageComponent),
                pathMatch: 'full'
            },
            {
                path: [ ':schemeName', ROUTE_SECTIONS.bindingCreate ].join('/'),
                loadComponent: () => import('./control-schemes/binding-create-page').then((m) => m.BindingCreatePageComponent),
                pathMatch: 'full'
            },
            {
                path: [ ':schemeName', ROUTE_SECTIONS.hubEdit, ':hubId', ROUTE_SECTIONS.portEdit, ':portId' ].join('/'),
                loadComponent: () => import('./control-schemes/port-config-edit-page').then((m) => m.PortConfigEditPageComponent),
                pathMatch: 'full'
            }
        ]
    },
    {
        path: ROUTE_SECTIONS.settings,
        loadComponent: () => import('./settings-page').then((m) => m.SettingsPageComponent),
        pathMatch: 'full'
    },
    {
        path: '**',
        component: NotFoundPageComponent,
    }
];
