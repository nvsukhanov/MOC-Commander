import { createEffect } from '@ngrx/effects';
import { inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { filter, tap } from 'rxjs';
import { Language } from '@app/shared-i18n';

import { SETTINGS_FEATURE } from '../../reducers';

export const SET_LANGUAGE_EFFECT = createEffect(
  (translocoService = inject(TranslocoService), store: Store = inject(Store)) => {
    return store.select(SETTINGS_FEATURE.selectLanguage).pipe(
      filter((l): l is Language => l !== null),
      tap((language) => {
        translocoService.setActiveLang(language);
      }),
    );
  },
  { dispatch: false, functional: true },
);
