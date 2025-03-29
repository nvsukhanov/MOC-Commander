import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { map } from 'rxjs';

import { CONTROL_SCHEME_ACTIONS, SHOW_NOTIFICATION_ACTIONS } from '../../actions';
import { OutOfRangeCalibrationError } from '../../hub-facades';

export const NOTIFY_ON_CONTROL_SCHEME_START_FAILURE_EFFECT = createEffect(
  (actions: Actions = inject(Actions)) => {
    return actions.pipe(
      ofType(CONTROL_SCHEME_ACTIONS.schemeStartFailed),
      map((action) => {
        const l10nKey =
          action.reason instanceof OutOfRangeCalibrationError
            ? 'controlScheme.runFailedCalibrationOutOfRange'
            : 'controlScheme.runFailed';
        return SHOW_NOTIFICATION_ACTIONS.error({
          l10nKey,
          l10nPayload: action,
        });
      }),
    );
  },
  { functional: true },
);
