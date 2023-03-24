import { bootstrapApplication } from '@angular/platform-browser';
import { LayoutComponent } from './app/main/layout';
import { provideRouter } from '@angular/router';
import { ROUTES } from './app/routes';
import { provideL10n } from './app/l10n';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideApplicationStore } from './app/store';
import { importProvidersFrom } from '@angular/core';
import { provideGamepadsPlugins } from './app/plugins';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideLpu } from './app/lego-hub';
import { BluetoothAvailabilityGuardService } from './app/bluetooth-availability';
import { LOG_LEVEL, LogLevel } from './app/logging';

bootstrapApplication(LayoutComponent, {
    providers: [
        provideRouter(ROUTES),
        provideL10n(), // TODO: replace later with a proper l10n library e.g. angular-l10n
        provideNoopAnimations(),
        provideGamepadsPlugins(),
        importProvidersFrom(MatSnackBarModule),
        provideLpu(),
        provideApplicationStore(),
        BluetoothAvailabilityGuardService,
        { provide: LOG_LEVEL, useValue: LogLevel.Debug }
    ]
});
