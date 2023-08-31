import { FunctionalEffect, createEffect } from '@ngrx/effects';
import { inject } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { SETTINGS_SELECTORS } from '@app/store';

const SET_LANGUAGE_EFFECT = createEffect((
    translocoService = inject(TranslocoService),
    store: Store = inject(Store)
) => {
    return store.select(SETTINGS_SELECTORS.language).pipe(
        tap((language) => translocoService.setActiveLang(language))
    );
}, { dispatch: false, functional: true });

export const SETTINGS_EFFECTS: { [name: string]: FunctionalEffect } = {
    setLanguage: SET_LANGUAGE_EFFECT
};