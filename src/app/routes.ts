import { Routes } from '@angular/router';
import { NotFoundComponent } from '@app/not-found';
import { ROUTE_SECTIONS } from '@app/shared-misc';

export const ROUTES: Routes = [
    {
        path: '',
        redirectTo: ROUTE_SECTIONS.controllers,
        pathMatch: 'full',
    },
    {
        path: ROUTE_SECTIONS.about,
        loadComponent: () => import('@app/about').then(m => m.AboutComponent),
        pathMatch: 'full',
    },
    {
        path: ROUTE_SECTIONS.bluetoothUnavailable,
        loadComponent: () => import('@app/bluetooth-unavailable').then(m => m.BluetoothUnavailableComponent),
        pathMatch: 'full',
    },
    {
        path: ROUTE_SECTIONS.controllers,
        children: [
            {
                path: '',
                loadComponent: () => import('@app/controllers-list').then(m => m.ControllersListComponent),
                pathMatch: 'full'
            },
            {
                path: [ ':id' ].join('/'),
                loadComponent: () => import('@app/controller-view').then(m => m.ControllerViewComponent),
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
                loadComponent: () => import('@app/control-schemes-list').then((m) => m.ControlSchemeListComponent),
                pathMatch: 'full',
            },
            {
                path: [ ':schemeName' ].join('/'),
                loadComponent: () => import('@app/control-scheme-view').then((m) => m.ControlSchemePageComponent),
                pathMatch: 'full',
            },
            {
                path: [ ':schemeName', ROUTE_SECTIONS.binding, ':bindingId' ].join('/'),
                loadComponent: () => import('@app/control-scheme-binding-edit').then((m) => m.BindingEditPageComponent),
                pathMatch: 'full'
            },
            {
                path: [ ':schemeName', ROUTE_SECTIONS.bindingCreate ].join('/'),
                loadComponent: () => import('@app/control-scheme-binding-create').then((m) => m.BindingCreateComponent),
                pathMatch: 'full'
            },
            {
                path: [ ':schemeName', ROUTE_SECTIONS.hubEdit, ':hubId', ROUTE_SECTIONS.portEdit, ':portId' ].join('/'),
                loadComponent: () => import('@app/control-scheme-port-config-edit').then((m) => m.PortConfigEditComponent),
                pathMatch: 'full'
            }
        ]
    },
    {
        path: ROUTE_SECTIONS.settings,
        loadComponent: () => import('@app/settings').then((m) => m.SettingsComponent),
        pathMatch: 'full'
    },
    {
        path: '**',
        component: NotFoundComponent,
    }
];
