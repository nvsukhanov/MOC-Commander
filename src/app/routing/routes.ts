import { Routes } from '@angular/router';
import { NotFoundComponent } from '@app/shared';

export const ROUTE_PATHS = {
    controllers: 'controllers',
    hubs: 'hubs',
    controlSchemes: 'control-schemes',
    binding: 'binding',
    bindingCreate: 'binding-create',
    portConfigEdit: 'port',
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
        path: ROUTE_PATHS.settings,
        loadComponent: () => import('../settings').then((m) => m.SettingsComponent),
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
                loadComponent: () => import('../control-schemes/control-scheme-list-page').then((m) => m.ControlSchemeListPageComponent),
                pathMatch: 'full',
            },
            {
                path: [ ':schemeId' ].join('/'),
                loadComponent: () => import('../control-schemes/control-scheme-page').then((m) => m.ControlSchemePageComponent),
                pathMatch: 'full',
            },
            {
                path: [ ':schemeId', ROUTE_PATHS.binding, ':bindingId' ].join('/'),
                loadComponent: () => import('../control-schemes/binding-edit-page').then((m) => m.BindingEditPageComponent),
                pathMatch: 'full'
            },
            {
                path: [ ':schemeId', ROUTE_PATHS.bindingCreate ].join('/'),
                loadComponent: () => import('../control-schemes/binding-create-page').then((m) => m.BindingCreatePageComponent),
                pathMatch: 'full'
            },
            {
                path: [ ':schemeId', ROUTE_PATHS.portConfigEdit, ':hubId', ':portId' ].join('/'),
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
