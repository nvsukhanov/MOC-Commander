import { bootstrapApplication } from '@angular/platform-browser';
import { LayoutComponent } from './app/main/layout';
import { provideRouter } from '@angular/router';
import { ROUTES } from './app/routes';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideApplicationStore } from './app/store';
import { importProvidersFrom, isDevMode } from '@angular/core';
import { provideGamepadsPlugins } from './app/plugins';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideLegoHubEnvironment } from './app/lego-hub';
import { LOG_LEVEL, LogLevel } from './app/logging';
import { CONFIGURE_CONTROLLER_I18N_SCOPE, GAMEPAD_PLUGINS_I18N_SCOPE, HUB_IO_I18N_SCOPE, provideI18n } from './app/i18n';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

bootstrapApplication(LayoutComponent, {
    providers: [
        provideRouter(ROUTES),
        provideI18n(),
        provideNoopAnimations(),
        provideGamepadsPlugins(),
        importProvidersFrom(MatSnackBarModule),
        provideLegoHubEnvironment(),
        provideApplicationStore(),
        { provide: LOG_LEVEL, useValue: isDevMode() ? LogLevel.Debug : LogLevel.Warning },
        { provide: TRANSLOCO_SCOPE, useValue: CONFIGURE_CONTROLLER_I18N_SCOPE, multi: true },
        { provide: TRANSLOCO_SCOPE, useValue: GAMEPAD_PLUGINS_I18N_SCOPE, multi: true },
        { provide: TRANSLOCO_SCOPE, useValue: HUB_IO_I18N_SCOPE, multi: true },
    ]
});
