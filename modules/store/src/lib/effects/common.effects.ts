import { Actions, FunctionalEffect, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { filter, pairwise, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { NAVIGATOR, WakeLockService } from '@app/shared-misc';

import { COMMON_ACTIONS } from '../actions';
import { HUB_RUNTIME_DATA_SELECTORS } from '../selectors';

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

const ACQUIRE_WAKE_LOCK_EFFECT = createEffect((
    wakeLockService: WakeLockService = inject(WakeLockService),
    store: Store = inject(Store)
) => {
    return store.select(HUB_RUNTIME_DATA_SELECTORS.selectTotal).pipe(
        pairwise(),
        filter(([a, b]) => a === 0 && b > 0),
        switchMap(() => wakeLockService.requestWakeLock())
    );
}, { functional: true, dispatch: false });

const RELEASE_WAKE_LOCK_EFFECT = createEffect((
    wakeLockService: WakeLockService = inject(WakeLockService),
    store: Store = inject(Store),
) => {
    return store.select(HUB_RUNTIME_DATA_SELECTORS.selectTotal).pipe(
        pairwise(),
        filter(([a, b]) => a > 0 && b === 0),
        switchMap(() => wakeLockService.releaseWakeLock())
    );
}, { functional: true, dispatch: false });

export const COMMON_EFFECTS: { [name: string]: FunctionalEffect }  = {
    copyToClipboard: COPY_TO_CLIPBOARD_EFFECT,
    acquireWakeLock: ACQUIRE_WAKE_LOCK_EFFECT,
    releaseWakeLock: RELEASE_WAKE_LOCK_EFFECT
};
