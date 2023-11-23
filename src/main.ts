import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ErrorStateMatcher } from '@angular/material/core';
import { provideRouting } from '@app/routing';
import { AppStoreVersion, provideApplicationStore } from '@app/store';
import { ShowOnTouchedErrorStateMatcher, provideControllerProfiles, provideI18n } from '@app/shared';

import { RootComponent } from './app/root';

// removing old ls store version prefixes.
// TODO: remove this code after a 2023-10-15
const prefix = [ AppStoreVersion.first, '/' ].join('');
for (const k in window.localStorage) {
    if (k.startsWith(prefix)) {
        const v = window.localStorage.getItem(k);
        if (!v) {
            continue;
        }
        window.localStorage.removeItem(k);
        window.localStorage.setItem(k.replace(prefix, ''), v);
    }
}

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
