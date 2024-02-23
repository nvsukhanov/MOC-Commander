import { Actions, FunctionalEffect, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, map, switchMap } from 'rxjs';

// eslint-disable-next-line @nx/enforce-module-boundaries
import packageJson from '../../../../../package.json';
import { IState } from '../i-state';
import { APP_UPDATE_ACTIONS, COMMON_ACTIONS } from '../actions';

export const APP_UPDATE_EFFECTS: {[k in string]: FunctionalEffect} = {
    detectAppUpdate: createEffect((
        // eslint-disable-next-line @ngrx/no-typed-global-store
        store: Store<IState> = inject(Store),
        actions$: Actions = inject(Actions)
    ) => {
        return actions$.pipe(
            ofType(COMMON_ACTIONS.appReady),
            switchMap(() => store.select((state) => state.appVersion)),
            map((prev) => ({
                prev,
                current: packageJson.version
            })),
            filter(({ prev, current }) => prev !== current),
            map(({prev, current}) => APP_UPDATE_ACTIONS.appUpdated({prev, current}))
        );
    }, { functional: true })
};
