import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { CONTROLLER_INPUT_ACTIONS } from '../actions';
import { CONTROLLER_INPUT_CAPTURE_SELECTORS } from '../selectors';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs';

@Injectable()
export class ControllerInputCaptureEffects {
    public readonly listenForInputCaptureRelease$ = createEffect(() => {
        return this.actions.pipe(
            ofType(CONTROLLER_INPUT_ACTIONS.releaseInputCapture),
            concatLatestFrom(() => this.store.select(CONTROLLER_INPUT_CAPTURE_SELECTORS.isCapturing)),
            filter(([ , isCapturing ]) => !isCapturing),
            map(() => CONTROLLER_INPUT_ACTIONS.inputCaptureReleased())
        );
    });

    public readonly listenForInputCapture$ = createEffect(() => {
        return this.actions.pipe(
            ofType(CONTROLLER_INPUT_ACTIONS.requestInputCapture),
            concatLatestFrom(() => this.store.select(CONTROLLER_INPUT_CAPTURE_SELECTORS.isCapturing)),
            filter(([ , isCapturing ]) => isCapturing),
            map(() => CONTROLLER_INPUT_ACTIONS.inputCapturing())
        );
    });

    constructor(
        private readonly actions: Actions,
        private readonly store: Store
    ) {
    }
}
