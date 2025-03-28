import { createEffect } from '@ngrx/effects';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs';
import { BROWSER_LANGUAGES, DEFAULT_LANGUAGE } from '@app/shared-i18n';
import { NAVIGATOR } from '@app/shared-misc';

import { SETTINGS_ACTIONS } from '../../actions';
import { SETTINGS_FEATURE } from '../../reducers';

export const DETECT_LANGUAGE_EFFECT = createEffect(
  (store: Store = inject(Store), navigator: Navigator = inject(NAVIGATOR)) => {
    return store.select(SETTINGS_FEATURE.selectLanguage).pipe(
      filter((language) => language === null),
      map(() => {
        const language = navigator.language.split('-')[0];
        return SETTINGS_ACTIONS.setLanguage({ language: BROWSER_LANGUAGES[language] ?? DEFAULT_LANGUAGE });
      }),
    );
  },
  { functional: true },
);
