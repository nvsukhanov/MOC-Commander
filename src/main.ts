import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { RootComponent } from './app/root';
import { provideApplicationStore } from './app/store';
import { provideI18n } from './app/i18n';
import { provideRouting } from './app/routing';
import { provideControllerProfiles } from './app/controller-profiles';

bootstrapApplication(RootComponent, {
    providers: [
        provideRouting(),
        provideI18n(),
        provideAnimations(),
        provideControllerProfiles(),
        importProvidersFrom(MatSnackBarModule),
        provideApplicationStore()
    ]
});
