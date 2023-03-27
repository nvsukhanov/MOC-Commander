import { bootstrapApplication } from '@angular/platform-browser';
import { LayoutComponent } from './app/main/layout';
import { provideRouter } from '@angular/router';
import { ROUTES } from './app/routes';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideApplicationStore } from './app/store';
import { importProvidersFrom } from '@angular/core';
import { provideGamepadsPlugins } from './app/plugins';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideLpu } from './app/lego-hub';
import { BluetoothAvailabilityGuardService } from './app/bluetooth-availability';
import { LOG_LEVEL, LogLevel } from './app/logging';
import { provideI18n } from './app/i18n';

bootstrapApplication(LayoutComponent, {
    providers: [
        provideRouter(ROUTES),
        provideI18n(),
        provideNoopAnimations(),
        provideGamepadsPlugins(),
        importProvidersFrom(MatSnackBarModule),
        provideLpu(),
        provideApplicationStore(),
        BluetoothAvailabilityGuardService,
        { provide: LOG_LEVEL, useValue: LogLevel.Debug }, // TODO: should consider dev/prod mode
    ]
});
