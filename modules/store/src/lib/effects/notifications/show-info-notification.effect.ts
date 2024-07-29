import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';

import { SHOW_NOTIFICATION_ACTIONS } from '../../actions';
import { NotificationFacadeService } from '../../notification-facade.service';

export const SHOW_INFO_NOTIFICATION_EFFECT = createEffect((
    actions: Actions = inject(Actions),
    notificationsFacadeService: NotificationFacadeService = inject(NotificationFacadeService),
    translocoService: TranslocoService = inject(TranslocoService),
) => {
    return actions.pipe(
        ofType(SHOW_NOTIFICATION_ACTIONS.info),
        tap((action) => notificationsFacadeService.showInfoNotification(
            translocoService.selectTranslate(action.l10nKey, action.l10nPayload),
        ))
    );
}, { functional: true, dispatch: false });
