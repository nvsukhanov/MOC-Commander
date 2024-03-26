import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { map } from 'rxjs';

import { HUBS_ACTIONS, SHOW_NOTIFICATION_ACTIONS } from '../../actions';

export const NOTIFY_ON_HUB_SET_NAME_ERROR_EFFECT = createEffect((
    actions: Actions = inject(Actions)
) => {
    return actions.pipe(
        ofType(HUBS_ACTIONS.hubNameSetError),
        map(() => SHOW_NOTIFICATION_ACTIONS.error({
            l10nKey: 'hub.hubNameSetError'
        }))
    );
}, { functional: true });
