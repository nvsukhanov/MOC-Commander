import { createEffect } from '@ngrx/effects';
import { inject } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs';

import { SETTINGS_FEATURE } from '../../reducers';

export const SET_LANGUAGE_EFFECT = createEffect((
    translocoService = inject(TranslocoService),
    store: Store = inject(Store),
) => {
    return store.select(SETTINGS_FEATURE.selectLanguage).pipe(
        tap((language) => {
            translocoService.setActiveLang(language);
        })
    );
}, { dispatch: false, functional: true });
