import { Actions, FunctionalEffect, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { switchMap } from 'rxjs';
import { NAVIGATOR, WakeLockService } from '@app/shared-misc';

import { COMMON_ACTIONS, CONTROL_SCHEME_ACTIONS } from '../actions';

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
    actions: Actions = inject(Actions),
    wakeLockService: WakeLockService = inject(WakeLockService)
) => {
    return actions.pipe(
        ofType(CONTROL_SCHEME_ACTIONS.schemeStarted),
        switchMap(() => wakeLockService.requestWakeLock())
    );
}, { functional: true, dispatch: false });

const RELEASE_WAKE_LOCK_EFFECT = createEffect((
    actions: Actions = inject(Actions),
    wakeLockService: WakeLockService = inject(WakeLockService)
) => {
    return actions.pipe(
        ofType(CONTROL_SCHEME_ACTIONS.schemeStopped),
        switchMap(() => wakeLockService.releaseWakeLock())
    );
}, { functional: true, dispatch: false });

export const COMMON_EFFECTS: { [name: string]: FunctionalEffect }  = {
    copyToClipboard: COPY_TO_CLIPBOARD_EFFECT,
    acquireWakeLock: ACQUIRE_WAKE_LOCK_EFFECT,
    releaseWakeLock: RELEASE_WAKE_LOCK_EFFECT
};
