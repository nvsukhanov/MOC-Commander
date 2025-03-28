import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { of, tap } from 'rxjs';

import { SHOW_NOTIFICATION_ACTIONS } from '../../actions';
import { NotificationFacadeService } from '../../notification-facade.service';

export const SHOW_GENERIC_ERROR_NOTIFICATION_EFFECT = createEffect(
  (actions: Actions = inject(Actions), notificationsFacadeService: NotificationFacadeService = inject(NotificationFacadeService)) => {
    return actions.pipe(
      ofType(SHOW_NOTIFICATION_ACTIONS.genericError),
      tap((action) => notificationsFacadeService.showErrorNotification(of(action.error.message))),
    );
  },
  { functional: true, dispatch: false },
);
