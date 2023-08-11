import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { Store } from '@ngrx/store';
import { CONTROLLERS_ACTIONS, CONTROLLER_SELECTORS, ControllerProfileFactoryService, HUBS_ACTIONS } from '@app/store';

export const LISTEN_HUB_CONNECT = createEffect((
    actions$: Actions = inject(Actions),
    controllerProfileFactory: ControllerProfileFactoryService = inject(ControllerProfileFactoryService),
    store: Store = inject(Store),
) => {
    return actions$.pipe(
        ofType(HUBS_ACTIONS.connected),
        concatLatestFrom((action) => store.select(CONTROLLER_SELECTORS.selectById(action.hubId))),
        map(([ action, existingController ]) => {
            if (existingController) {
                return CONTROLLERS_ACTIONS.hubConnected({ hubId: action.hubId });
            }
            const profile = controllerProfileFactory.getHubProfile(action.hubId);
            return CONTROLLERS_ACTIONS.hubDiscovered({
                hubId: action.hubId,
                profileUid: profile.uid,
            });
        })
    );
}, { functional: true });
