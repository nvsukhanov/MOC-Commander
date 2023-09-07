import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ErrorStateMatcher } from '@angular/material/core';
import { provideRouting } from '@app/routing';
import { provideApplicationStore } from '@app/store';

import { ShowOnTouchedErrorStateMatcher } from './app/shared/validation-errors';
import { RootComponent } from './app/root';
import { provideI18n } from './app/shared/i18n';
import { provideControllerProfiles } from './app/shared/controller-profiles';

bootstrapApplication(RootComponent, {
    providers: [
        provideRouting(),
        provideI18n(),
        provideAnimations(),
        provideControllerProfiles(),
        importProvidersFrom(MatSnackBarModule),
        provideApplicationStore(),
        { provide: ErrorStateMatcher, useClass: ShowOnTouchedErrorStateMatcher }
    ]
});
