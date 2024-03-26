import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { filter, map, mergeMap, switchMap, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { GamepadProfileFactoryService } from '@app/controller-profiles';

import { CONTROLLERS_ACTIONS, SHOW_NOTIFICATION_ACTIONS } from '../../../actions';
import { ControllerModel } from '../../../models';
import { CONTROLLER_SELECTORS } from '../../../selectors';

export const NOTIFY_ON_GAMEPAD_DISCONNECTED_EFFECT = createEffect((
    actions: Actions = inject(Actions),
    store: Store = inject(Store),
    gamepadProfileFactoryService: GamepadProfileFactoryService = inject(GamepadProfileFactoryService),
) => {
    return actions.pipe(
        ofType(CONTROLLERS_ACTIONS.gamepadDisconnected),
        mergeMap((action) =>
            store.select(CONTROLLER_SELECTORS.selectById(action.id)).pipe(
                filter((controller): controller is ControllerModel => !!controller),
                switchMap((controller) => gamepadProfileFactoryService.getByProfileUid(controller.profileUid).name$),
                take(1),
                map((name) => SHOW_NOTIFICATION_ACTIONS.info({
                    l10nKey: 'controller.controllerDisconnectedNotification',
                    l10nPayload: { name }
                }))
            )
        ),
    );
}, { functional: true });


