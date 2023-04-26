import { Routes } from '@angular/router';
import { EmptyViewComponent } from './main';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { CONFIGURE_CONTROLLER_I18N_SCOPE, GAMEPAD_PLUGINS_I18N_SCOPE, HUB_IO_I18N_SCOPE } from './i18n';
import { NotFoundComponent } from './common';

export const HUB_ROUTE = 'hub';
export const HUB_EDIT_SUBROUTE = 'edit';
export const CONTROL_SCHEME_ROUTE = 'control-scheme';
export const CONTROL_SCHEME_CREATE_SUBROUTE = 'create';
export const CONTROL_SCHEME_EDIT_SUBROUTE = 'edit';

export const ROUTES: Routes = [
    {
        path: '',
        component: EmptyViewComponent,
        pathMatch: 'full',
        providers: [
            { provide: TRANSLOCO_SCOPE, useValue: CONFIGURE_CONTROLLER_I18N_SCOPE, multi: true },
            { provide: TRANSLOCO_SCOPE, useValue: GAMEPAD_PLUGINS_I18N_SCOPE, multi: true },
            { provide: TRANSLOCO_SCOPE, useValue: HUB_IO_I18N_SCOPE, multi: true },
        ]
    },
    {
        path: [ HUB_ROUTE, ':id' ].join('/'),
        loadComponent: () => import('./hubs/hub-view').then(m => m.HubViewComponent),
        pathMatch: 'full',
        providers: [
            { provide: TRANSLOCO_SCOPE, useValue: HUB_IO_I18N_SCOPE, multi: true },
        ]
    },
    {
        path: [ HUB_ROUTE, ':id', HUB_EDIT_SUBROUTE ].join('/'),
        loadComponent: () => import('./hubs/hub-edit').then(m => m.HubEditComponent),
        pathMatch: 'full',
        providers: [
            { provide: TRANSLOCO_SCOPE, useValue: HUB_IO_I18N_SCOPE, multi: true },
        ]
    },
    {
        path: [ CONTROL_SCHEME_ROUTE, CONTROL_SCHEME_CREATE_SUBROUTE ].join('/'),
        loadComponent: () => import('./control-schemes/create').then(m => m.ControlSchemeCreateComponent),
        pathMatch: 'full',
    },
    {
        path: [ CONTROL_SCHEME_ROUTE, ':id' ].join('/'),
        loadComponent: () => import('./control-schemes/view').then(m => m.ControlSchemeViewComponent),
        pathMatch: 'full',
    },
    {
        path: [ CONTROL_SCHEME_ROUTE, ':id', CONTROL_SCHEME_EDIT_SUBROUTE ].join('/'),
        loadComponent: () => import('./control-schemes/edit').then(m => m.ControlSchemeEditComponent),
        pathMatch: 'full'
    },
    {
        path: '**',
        component: NotFoundComponent,
    }
];
