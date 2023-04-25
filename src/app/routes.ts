import { Routes } from '@angular/router';
import { EmptyViewComponent } from './main';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { CONFIGURE_CONTROLLER_I18N_SCOPE, GAMEPAD_PLUGINS_I18N_SCOPE, HUB_IO_I18N_SCOPE } from './i18n';
import { NotFoundComponent } from './not-found';

export const HUB_VIEW_ROUTE = 'hub';
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
        path: [ HUB_VIEW_ROUTE, ':id' ].join('/'),
        loadComponent: () => import('./hubs').then(m => m.HubViewComponent),
        providers: [
            { provide: TRANSLOCO_SCOPE, useValue: HUB_IO_I18N_SCOPE, multi: true },
        ]
    },
    {
        path: [ CONTROL_SCHEME_ROUTE, CONTROL_SCHEME_CREATE_SUBROUTE ].join('/'),
        loadComponent: () => import('./control-scheme/create').then(m => m.ControlSchemeCreateComponent),
        pathMatch: 'full',
    },
    {
        path: [ CONTROL_SCHEME_ROUTE, ':id' ].join('/'),
        loadComponent: () => import('./control-scheme/view').then(m => m.ControlSchemeViewComponent),
        pathMatch: 'full',
    },
    {
        path: [ CONTROL_SCHEME_ROUTE, ':id', CONTROL_SCHEME_EDIT_SUBROUTE ].join('/'),
        loadComponent: () => import('./control-scheme/edit').then(m => m.ControlSchemeEditComponent),
        pathMatch: 'full'
    },
    {
        path: '**',
        component: NotFoundComponent,
    }
];
