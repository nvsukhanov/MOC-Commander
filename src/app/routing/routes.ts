import { Routes } from '@angular/router';
import { NotFoundComponent } from '@app/shared';

export const ROUTE_PATHS = {
    controllers: 'controllers',
    hubs: 'hubs',
    controlSchemes: 'control-schemes',
    binding: 'binding',
    bindingCreate: 'binding-create',
    portEdit: 'port',
    hubEdit: 'edit',
    controlSchemeCreate: 'create',
    about: 'about',
    bluetoothUnavailable: 'bluetooth-unavailable',
    settings: 'settings'
} as const;

export const ROUTES: Routes = [
    {
        path: '',
        redirectTo: ROUTE_PATHS.controllers,
        pathMatch: 'full',
    },
    {
        path: ROUTE_PATHS.about,
        loadComponent: () => import('../about-page').then(m => m.AboutPageComponent),
        pathMatch: 'full',
    },
    {
        path: ROUTE_PATHS.bluetoothUnavailable,
        loadComponent: () => import('../bluetooth-unavailable-page').then(m => m.BluetoothUnavailablePageComponent),
        pathMatch: 'full',
    },
    {
        path: ROUTE_PATHS.controllers,
        loadComponent: () => import('../controllers-list-page').then(m => m.ControllersListPageComponent),
        pathMatch: 'full'
    },
    {
        path: ROUTE_PATHS.settings,
        loadComponent: () => import('../settings-page').then((m) => m.SettingsPageComponent),
        pathMatch: 'full'
    },
    {
        path: ROUTE_PATHS.hubs,
        children: [
            {
                path: '',
                loadComponent: () => import('../hubs/hubs-list-page').then(m => m.HubsListPageComponent),
                pathMatch: 'full',
            },
            {
                path: [ ':id' ].join('/'),
                loadComponent: () => import('../hubs/hub-view-page').then(m => m.HubViewPageComponent),
                pathMatch: 'full'
            },
            {
                path: [ ':id', ROUTE_PATHS.hubEdit ].join('/'),
                loadComponent: () => import('../hubs/hub-edit-page').then(m => m.HubEditPageComponent),
                pathMatch: 'full',
            },
        ]
    },
    {
        path: ROUTE_PATHS.controlSchemes,
        children: [
            {
                path: '',
                loadComponent: () => import('../control-schemes/control-scheme-list-page').then((m) => m.ControlSchemeListPageComponent),
                pathMatch: 'full',
            },
            {
                path: [ ':schemeName' ].join('/'),
                loadComponent: () => import('../control-schemes/control-scheme-page').then((m) => m.ControlSchemePageComponent),
                pathMatch: 'full',
            },
            {
                path: [ ':schemeName', ROUTE_PATHS.binding, ':bindingId' ].join('/'),
                loadComponent: () => import('../control-schemes/binding-edit-page').then((m) => m.BindingEditPageComponent),
                pathMatch: 'full'
            },
            {
                path: [ ':schemeName', ROUTE_PATHS.bindingCreate ].join('/'),
                loadComponent: () => import('../control-schemes/binding-create-page').then((m) => m.BindingCreatePageComponent),
                pathMatch: 'full'
            },
            {
                path: [ ':schemeName', ROUTE_PATHS.hubEdit, ':hubId', ROUTE_PATHS.portEdit, ':portId' ].join('/'),
                loadComponent: () => import('../control-schemes/port-config-edit-page').then((m) => m.PortConfigEditPageComponent),
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '**',
        component: NotFoundComponent,
    }
];
