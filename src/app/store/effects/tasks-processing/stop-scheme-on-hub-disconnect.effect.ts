import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { filter, map } from 'rxjs';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { CONTROL_SCHEME_ACTIONS, CONTROL_SCHEME_SELECTORS, HUBS_ACTIONS } from '@app/store';

export const STOP_SCHEME_ON_HUB_DISCONNECT_EFFECT = createEffect((
    actions: Actions = inject(Actions),
    store: Store = inject(Store)
) => {
    return actions.pipe(
        ofType(HUBS_ACTIONS.disconnected),
        concatLatestFrom(() => store.select(CONTROL_SCHEME_SELECTORS.selectRunningScheme)),
        filter(([ action, runningScheme ]) => !!runningScheme?.bindings.some((binding) => binding.hubId === action.hubId)),
        map(() => CONTROL_SCHEME_ACTIONS.stopScheme())
    );
}, { functional: true });
