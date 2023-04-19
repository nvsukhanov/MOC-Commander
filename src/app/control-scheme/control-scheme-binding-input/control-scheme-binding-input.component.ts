import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BehaviorSubject, EMPTY, map, Observable, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import {
    GAMEPAD_AXES_STATE_SELECTORS,
    GAMEPAD_BUTTONS_STATE_SELECTORS,
    GAMEPAD_SELECTORS,
    GamepadAxisConfig,
    GamepadButtonConfig,
    GamepadButtonState,
    GamepadButtonType,
    GamepadConfig,
    GamepadInputMethod
} from '../../store';
import { JsonPipe, NgSwitch, NgSwitchCase } from '@angular/common';
import { LetModule, PushModule } from '@ngrx/component';
import { TranslocoModule } from '@ngneat/transloco';

export type ControlSchemeAxisBindingInputConfig = {
    readonly gamepadId: number;
    readonly inputMethod: GamepadInputMethod.Axis;
    readonly gamepadAxisId: number
}

export type ControlSchemeButtonBindingInputConfig = {
    readonly gamepadId: number;
    readonly inputMethod: GamepadInputMethod.Button;
    readonly gamepadButtonId: number
}

export type ControlSchemeBindingInputConfig = ControlSchemeAxisBindingInputConfig | ControlSchemeButtonBindingInputConfig;

@Component({
    standalone: true,
    selector: 'app-control-scheme-binding-input',
    templateUrl: './control-scheme-binding-input.component.html',
    styleUrls: [ './control-scheme-binding-input.component.scss' ],
    imports: [
        NgSwitch,
        PushModule,
        JsonPipe,
        LetModule,
        NgSwitchCase,
        TranslocoModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeBindingInputComponent {
    public readonly gamepadConfig$: Observable<GamepadConfig | undefined>;

    public readonly inputMethod$: Observable<GamepadInputMethod | undefined>;

    public readonly axisConfig$: Observable<GamepadAxisConfig | undefined>;

    public readonly axisValue$: Observable<number | undefined>;

    public readonly buttonConfig$: Observable<GamepadButtonConfig | undefined>;

    public readonly buttonValue$: Observable<GamepadButtonState | undefined>;

    public readonly inputMethods = GamepadInputMethod;

    public readonly gamepadButtonsTypes = GamepadButtonType;

    private readonly inputConfig$ = new BehaviorSubject<ControlSchemeBindingInputConfig | undefined>(undefined);

    constructor(
        private readonly store: Store
    ) {
        this.inputMethod$ = this.inputConfig$.pipe(
            map((config) => config?.inputMethod)
        );

        this.axisConfig$ = this.inputConfig$.pipe(
            switchMap((config) => config !== undefined && config.inputMethod === GamepadInputMethod.Axis
                                  ? this.store.select(GAMEPAD_SELECTORS.selectAxisConfigByIndex(config.gamepadId, config.gamepadAxisId))
                                  : EMPTY
            )
        );

        this.axisValue$ = this.inputConfig$.pipe(
            switchMap((config) => config !== undefined && config.inputMethod === GamepadInputMethod.Axis
                                  ? this.store.select(GAMEPAD_AXES_STATE_SELECTORS.selectValueByIndex(config.gamepadId, config.gamepadAxisId))
                                  : EMPTY
            )
        );

        this.buttonConfig$ = this.inputConfig$.pipe(
            switchMap((config) => config !== undefined && config.inputMethod === GamepadInputMethod.Button
                                  ? this.store.select(GAMEPAD_SELECTORS.selectButtonConfigByIndex(config.gamepadId, config.gamepadButtonId))
                                  : EMPTY
            )
        );

        this.buttonValue$ = this.inputConfig$.pipe(
            switchMap((config) => config !== undefined && config.inputMethod === GamepadInputMethod.Button
                                  ? this.store.select(GAMEPAD_BUTTONS_STATE_SELECTORS.selectByIndex(config.gamepadId, config.gamepadButtonId))
                                  : EMPTY
            )
        );

        this.gamepadConfig$ = this.inputConfig$.pipe(
            switchMap((config) => config !== undefined
                                  ? this.store.select(GAMEPAD_SELECTORS.selectById(config.gamepadId))
                                  : EMPTY
            )
        );
    }

    @Input()
    public set inputConfig(config: ControlSchemeBindingInputConfig | undefined) {
        this.inputConfig$.next(config);
    }
}
