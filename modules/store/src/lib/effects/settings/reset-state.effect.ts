import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { WINDOW } from '@app/shared-misc';

import { SETTINGS_ACTIONS } from '../../actions';

export const RESET_STATE_EFFECT = createEffect(
  (actions$: Actions = inject(Actions), window: Window = inject(WINDOW)) => {
    return actions$.pipe(
      ofType(SETTINGS_ACTIONS.resetState),
      tap(() => window.location.reload()),
    );
  },
  { functional: true, dispatch: false },
);
