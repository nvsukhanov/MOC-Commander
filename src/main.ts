import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom, isDevMode } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ErrorStateMatcher } from '@angular/material/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { provideWidgets } from '@app/widgets';
import { provideControllerProfiles } from '@app/controller-profiles';
import { APP_VERSION, ShowOnTouchedErrorStateMatcher } from '@app/shared-misc';
import { provideI18n } from '@app/shared-i18n';
import { provideApplicationStore } from '@app/store';
import { provideBindings } from '@app/bindings';

import { RootComponent } from './app';
import { ROUTES } from './routes';
import packageJson from '../package.json';

bootstrapApplication(RootComponent, {
    providers: [
        provideRouter(ROUTES, withPreloading(PreloadAllModules)),
        provideI18n(),
        provideAnimations(),
        provideControllerProfiles(),
        importProvidersFrom(MatSnackBarModule),
        provideApplicationStore(),
        provideBindings(),
        provideWidgets(),
        { provide: ErrorStateMatcher, useClass: ShowOnTouchedErrorStateMatcher },
        provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
        }),
        { provide: APP_VERSION, useValue: packageJson.version }
    ]
});
