import { createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { filter, tap } from 'rxjs';
import { Language } from '@app/shared-i18n';

import { SETTINGS_FEATURE } from '../../reducers';

export const SET_PAGE_LANGUAGE_EFFECT = createEffect(
  (store: Store = inject(Store), document: Document = inject(DOCUMENT)) => {
    return store.select(SETTINGS_FEATURE.selectLanguage).pipe(
      filter((l): l is Language => l !== null),
      tap((language) => {
        document.documentElement.lang = language;
      }),
    );
  },
  { dispatch: false, functional: true },
);
