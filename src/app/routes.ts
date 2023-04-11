import { Routes } from '@angular/router';
import { EmptyViewComponent, NotFoundComponent } from './main';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { CONFIGURE_CONTROLLER_I18N_SCOPE, GAMEPAD_PLUGINS_I18N_SCOPE, HUB_IO_I18N_SCOPE } from './i18n';

export const HUB_VIEW_ROUTE = 'hub-view';

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
        loadComponent: () => import('./hub-view/hub-view').then(m => m.HubViewComponent),
        providers: [
            { provide: TRANSLOCO_SCOPE, useValue: HUB_IO_I18N_SCOPE, multi: true },
        ]
    },
    {
        path: '**',
        component: NotFoundComponent,
    }
];
