import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { tap } from 'rxjs';

import { SHOW_NOTIFICATION_ACTIONS } from '../../actions';
import { NotificationFacadeService } from '../../notification-facade.service';

export const SHOW_APP_UPDATED_NOTIFICATION_EFFECT = createEffect(
  (actions: Actions = inject(Actions), notificationsFacadeService: NotificationFacadeService = inject(NotificationFacadeService)) => {
    return actions.pipe(
      ofType(SHOW_NOTIFICATION_ACTIONS.appUpdated),
      tap(() => notificationsFacadeService.showAppUpdatedNotification()),
    );
  },
  { functional: true, dispatch: false },
);
