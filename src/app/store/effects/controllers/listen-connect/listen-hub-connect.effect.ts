import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { Store } from '@ngrx/store';
import { HubProfileFactoryService } from '@app/shared';

import { CONTROLLERS_ACTIONS, HUBS_ACTIONS } from '../../../actions';
import { CONTROLLER_SELECTORS } from '../../../selectors';

export const LISTEN_HUB_CONNECT = createEffect((
    actions$: Actions = inject(Actions),
    hubProfileFactoryService: HubProfileFactoryService = inject(HubProfileFactoryService),
    store: Store = inject(Store),
) => {
    return actions$.pipe(
        ofType(HUBS_ACTIONS.connected),
        concatLatestFrom((action) => store.select(CONTROLLER_SELECTORS.selectById(action.hubId))),
        map(([ action, existingController ]) => {
            if (existingController) {
                return CONTROLLERS_ACTIONS.hubConnected({ hubId: action.hubId });
            }
            const profile = hubProfileFactoryService.getHubProfile(action.hubId);
            return CONTROLLERS_ACTIONS.hubDiscovered({
                hubId: action.hubId,
                profileUid: profile.uid,
                defaultSettings: profile.getDefaultSettings()
            });
        })
    );
}, { functional: true });
