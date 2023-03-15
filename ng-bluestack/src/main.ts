import { bootstrapApplication } from '@angular/platform-browser';
import { LayoutComponent } from './app/layout';
import { provideRouter } from '@angular/router';
import { ROUTES } from './app/routes';
import { provideL10n } from './app/l10n';
import { provideStore } from '@ngrx/store';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { CONTROLLER_ACTIONS_REDUCER, CONTROLLER_CONFIG_REDUCERS, IState } from './app/store';

bootstrapApplication(LayoutComponent, {
    providers: [
        provideRouter(ROUTES),
        provideL10n(), // TODO: replace later with a proper l10n library e.g. angular-l10n
        provideStore<IState>({
            controllerConfig: CONTROLLER_CONFIG_REDUCERS,
            controllerState: CONTROLLER_ACTIONS_REDUCER
        }),
        provideNoopAnimations()
    ]
});
