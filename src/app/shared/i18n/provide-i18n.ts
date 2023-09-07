import { EnvironmentProviders, importProvidersFrom, isDevMode, makeEnvironmentProviders } from '@angular/core';
import { TRANSLOCO_CONFIG, TRANSLOCO_LOADER, TranslocoModule, translocoConfig } from '@ngneat/transloco';
import { provideHttpClient } from '@angular/common/http';
import { TranslocoMessageFormatModule } from '@ngneat/transloco-messageformat';

import { I18nLoaderService } from './i18n-loader.service';
import { Language } from './language';
import { LOCALES } from './locales';

export function provideI18n(): EnvironmentProviders {
    return makeEnvironmentProviders([
        {
            provide: TRANSLOCO_CONFIG,
            useValue: translocoConfig({
                availableLangs: Object.values(Language),
                defaultLang: Language.English,
                reRenderOnLangChange: true,
                prodMode: !isDevMode()
            })
        },
        { provide: TRANSLOCO_LOADER, useClass: I18nLoaderService },
        importProvidersFrom(TranslocoModule),
        importProvidersFrom(TranslocoMessageFormatModule.forRoot({
            locales: [
                LOCALES[Language.English],
                LOCALES[Language.Russian]
            ]
        })),
        provideHttpClient()
    ]);
}
