import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { map } from 'rxjs';

import { CONTROL_SCHEME_ACTIONS, SHOW_NOTIFICATION_ACTIONS } from '../../actions';

export const NOTIFY_ON_CONTROL_SCHEME_STARTED_EFFECT = createEffect((
    actions: Actions = inject(Actions),
) => {
    return actions.pipe(
        ofType(CONTROL_SCHEME_ACTIONS.schemeStarted),
        map((action) => {
            return SHOW_NOTIFICATION_ACTIONS.info({
                l10nKey: 'controlScheme.runSuccessNotification',
                l10nPayload: action
            });
        })
    );
}, { functional: true });
