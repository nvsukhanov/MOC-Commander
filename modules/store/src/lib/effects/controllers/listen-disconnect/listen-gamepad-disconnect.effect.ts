import { createEffect } from '@ngrx/effects';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, filter, fromEvent, map } from 'rxjs';
import { concatLatestFrom } from '@ngrx/operators';
import { WINDOW } from '@app/shared-misc';

import { CONTROLLERS_ACTIONS } from '../../../actions';
import { CONTROLLER_CONNECTION_SELECTORS } from '../../../selectors';

const GAMEPAD_DISCONNECT_EVENT = 'gamepaddisconnected';

export const LISTEN_GAMEPAD_DISCONNECT = createEffect((
    window: Window = inject(WINDOW),
    store: Store = inject(Store),
) => {
    return (fromEvent(window, GAMEPAD_DISCONNECT_EVENT) as Observable<GamepadEvent>).pipe(
        map((gamepadEvent) => gamepadEvent.gamepad),
        concatLatestFrom((gamepad) => store.select(CONTROLLER_CONNECTION_SELECTORS.selectByGamepadIndex(gamepad.index))),
        filter(([ , connection ]) => !!connection),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        map(([ , connection ]) => CONTROLLERS_ACTIONS.gamepadDisconnected({ id: connection!.controllerId }))
    );
}, { functional: true });
