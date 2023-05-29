import { EnvironmentProviders, importProvidersFrom, isDevMode, makeEnvironmentProviders } from '@angular/core';
import { TRANSLOCO_CONFIG, TRANSLOCO_LOADER, translocoConfig, TranslocoModule } from '@ngneat/transloco';
import { I18nLoaderService } from './i18n-loader.service';
import { provideHttpClient } from '@angular/common/http';
import { TranslocoMessageFormatModule } from '@ngneat/transloco-messageformat';

export function provideI18n(): EnvironmentProviders {
    return makeEnvironmentProviders([
        {
            provide: TRANSLOCO_CONFIG,
            useValue: translocoConfig({
                availableLangs: [ 'en' ],
                defaultLang: 'en',
                prodMode: !isDevMode()
            })
        },
        { provide: TRANSLOCO_LOADER, useClass: I18nLoaderService },
        importProvidersFrom(TranslocoModule),
        importProvidersFrom(TranslocoMessageFormatModule.forRoot({
            locales: [
                'en-Us'
            ]
        })),
        provideHttpClient()
    ]);
}
