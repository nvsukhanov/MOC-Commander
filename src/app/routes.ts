import { Routes } from '@angular/router';
import { EmptyViewComponent, NotFoundComponent } from './main';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { CONFIGURE_CONTROLLER_I18N_SCOPE, CONFIGURE_HUB_I18N_SCOPE, GAMEPAD_PLUGINS_I18N_SCOPE } from './i18n';

export const CONFIGURE_CONTROLLER_ROUTE = 'configure-controller';
export const CONFIGURE_HUB_ROUTE = 'configure-hub';

export const ROUTES: Routes = [
    {
        path: '',
        component: EmptyViewComponent,
        pathMatch: 'full',
        providers: [
            { provide: TRANSLOCO_SCOPE, useValue: CONFIGURE_CONTROLLER_I18N_SCOPE, multi: true },
            { provide: TRANSLOCO_SCOPE, useValue: GAMEPAD_PLUGINS_I18N_SCOPE, multi: true },
            { provide: TRANSLOCO_SCOPE, useValue: CONFIGURE_HUB_I18N_SCOPE, multi: true },
        ]
    },
    {
        path: '**',
        component: NotFoundComponent,
    }
];
