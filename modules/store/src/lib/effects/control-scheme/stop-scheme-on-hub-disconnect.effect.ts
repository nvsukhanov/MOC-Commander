import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map } from 'rxjs';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { concatLatestFrom } from '@ngrx/operators';

import { CONTROL_SCHEME_ACTIONS, HUBS_ACTIONS } from '../../actions';
import { CONTROL_SCHEME_SELECTORS } from '../../selectors';

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
