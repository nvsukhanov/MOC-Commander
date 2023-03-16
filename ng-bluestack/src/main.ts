import { bootstrapApplication } from '@angular/platform-browser';
import { LayoutComponent } from './app/layout';
import { provideRouter } from '@angular/router';
import { ROUTES } from './app/routes';
import { provideL10n } from './app/l10n';
import { provideStore } from '@ngrx/store';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { CONFIGURE_CONTROLLER_REDUCER, CONFIGURE_HUB_REDUCERS, ConfigureControllerEffects, IState } from './app/store';
import { provideEffects } from '@ngrx/effects';
import { isDevMode } from '@angular/core';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideGamepadsPlugins } from './app/plugins';

bootstrapApplication(LayoutComponent, {
    providers: [
        provideRouter(ROUTES),
        provideL10n(), // TODO: replace later with a proper l10n library e.g. angular-l10n
        provideStore<IState>({
            controller: CONFIGURE_CONTROLLER_REDUCER,
            hub: CONFIGURE_HUB_REDUCERS
        }),
        provideEffects(ConfigureControllerEffects),
        provideNoopAnimations(),
        provideGamepadsPlugins(),
        provideStoreDevtools({
            maxAge: 25,
            logOnly: !isDevMode(),
            autoPause: true,
            trace: false,
            traceLimit: 75,
        }),
    ]
});
