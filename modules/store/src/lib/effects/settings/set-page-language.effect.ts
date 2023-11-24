import { createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { tap } from 'rxjs';

import { SETTINGS_FEATURE } from '../../reducers';

export const SET_PAGE_LANGUAGE_EFFECT = createEffect((
    store: Store = inject(Store),
    document: Document = inject(DOCUMENT)
) => {
    return store.select(SETTINGS_FEATURE.selectLanguage).pipe(
        tap((language) => {
            document.documentElement.lang = language;
        })
    );
}, { dispatch: false, functional: true });
