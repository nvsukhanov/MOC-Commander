import { bootstrapApplication } from '@angular/platform-browser';
import { LayoutComponent } from './app/layout';
import { provideRouter } from '@angular/router';
import { ROUTES } from './app/routes';
import { provideL10n } from './app/l10n';
import { provideStore } from '@ngrx/store';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ConfigureControllerEffects, CONTROLLER_CONFIG_REDUCERS, IState } from './app/store';
import { provideEffects } from '@ngrx/effects';
import { provideGamepadMappers } from './app/mappings';
import { isDevMode } from '@angular/core';
import { provideStoreDevtools } from '@ngrx/store-devtools';

bootstrapApplication(LayoutComponent, {
    providers: [
        provideRouter(ROUTES),
        provideL10n(), // TODO: replace later with a proper l10n library e.g. angular-l10n
        provideStore<IState>({
            controller: CONTROLLER_CONFIG_REDUCERS
        }),
        provideEffects(ConfigureControllerEffects),
        provideNoopAnimations(),
        provideGamepadMappers(),
        provideStoreDevtools({
            maxAge: 25,
            logOnly: !isDevMode(),
            autoPause: true,
            trace: false,
            traceLimit: 75,
        }),
    ]
});
