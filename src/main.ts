import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { LayoutComponent } from './app/main';
import { provideApplicationStore } from './app/store';
import { provideI18n } from './app/i18n';
import { provideRouting } from './app/routing';
import { provideControllersPlugins } from './app/plugins';

bootstrapApplication(LayoutComponent, {
    providers: [
        provideRouting(),
        provideI18n(),
        provideAnimations(),
        provideControllersPlugins(),
        importProvidersFrom(MatSnackBarModule),
        provideApplicationStore()
    ]
});
