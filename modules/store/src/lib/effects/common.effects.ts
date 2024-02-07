import { Actions, FunctionalEffect, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { switchMap } from 'rxjs';
import { NAVIGATOR } from '@app/shared-misc';

import { COMMON_ACTIONS } from '../actions';

const COPY_TO_CLIPBOARD_EFFECT = createEffect((
    actions: Actions = inject(Actions),
    navigator: Navigator = inject(NAVIGATOR)
) => {
    return actions.pipe(
        ofType(COMMON_ACTIONS.copyToClipboard),
        switchMap(async (action) => {
            try {
                await navigator.clipboard.writeText(action.content);
                return COMMON_ACTIONS.copyToClipboardSuccess();
            } catch (e) {
                return COMMON_ACTIONS.copyToClipboardFailure();
            }
        })
    );
}, { functional: true });

export const COMMON_EFFECTS: { [name: string]: FunctionalEffect }  = {
    copyToClipboard: COPY_TO_CLIPBOARD_EFFECT
};
