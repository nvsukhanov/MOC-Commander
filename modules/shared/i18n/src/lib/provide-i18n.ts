import { EnvironmentProviders, isDevMode, makeEnvironmentProviders } from '@angular/core';
import { provideTransloco } from '@ngneat/transloco';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslocoMessageformat } from '@ngneat/transloco-messageformat';
import { getEnumValues } from '@app/shared-misc';

import { I18nLoaderService } from './i18n-loader.service';
import { Language } from './language';
import { DEFAULT_LANGUAGE } from './locales';

export function provideI18n(): EnvironmentProviders {
    return makeEnvironmentProviders([
        provideTransloco({
            config: {
                availableLangs: getEnumValues(Language),
                defaultLang: DEFAULT_LANGUAGE,
                reRenderOnLangChange: true,
                prodMode: !isDevMode()
            },
            loader: I18nLoaderService
        }),
        provideTranslocoMessageformat({
            locales: getEnumValues(Language)
        }),
        provideHttpClient()
    ]);
}
