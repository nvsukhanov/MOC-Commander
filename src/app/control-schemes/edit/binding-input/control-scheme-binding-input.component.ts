import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { map, NEVER, Observable, of, startWith, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import {
    GAMEPAD_AXES_STATE_SELECTORS,
    GAMEPAD_BUTTONS_STATE_SELECTORS,
    GAMEPAD_SELECTORS,
    GamepadAxisConfig,
    GamepadButtonConfig,
    GamepadButtonState,
    GamepadButtonType,
    GamepadInputMethod
} from '../../../store';
import { JsonPipe, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { LetModule, PushModule } from '@ngrx/component';
import { TranslocoModule } from '@ngneat/transloco';
import { FormControl, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

export type ControlSchemeBindingInputForm = FormGroup<{
    gamepadId: FormControl<number>,
    gamepadInputMethod: FormControl<GamepadInputMethod>,
    gamepadAxisId: FormControl<number | null>,
    gamepadButtonId: FormControl<number | null>,
}>;

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
        TranslocoModule,
        MatCardModule,
        MatListModule,
        NgIf
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeBindingInputComponent {
    public readonly inputMethods = GamepadInputMethod;

    public readonly gamepadButtonsTypes = GamepadButtonType;

    private _gamepadNameL10nKey$: Observable<string> = NEVER;

    private _inputMethod$: Observable<GamepadInputMethod> = NEVER;

    private _axisConfig$: Observable<GamepadAxisConfig | undefined> = NEVER;

    private _axisValue$: Observable<number | undefined> = NEVER;

    private _buttonConfig$: Observable<GamepadButtonConfig | undefined> = NEVER;

    private _buttonValue$: Observable<GamepadButtonState | undefined> = NEVER;

    constructor(
        private readonly store: Store
    ) {
    }

    public get gamepadNameL10nKey$(): Observable<string> {
        return this._gamepadNameL10nKey$;
    }

    public get inputMethod$(): Observable<GamepadInputMethod> {
        return this._inputMethod$;
    }

    public get axisConfig$(): Observable<GamepadAxisConfig | undefined> {
        return this._axisConfig$;
    }

    public get axisValue$(): Observable<number | undefined> {
        return this._axisValue$;
    }

    public get buttonConfig$(): Observable<GamepadButtonConfig | undefined> {
        return this._buttonConfig$;
    }

    public get buttonValue$(): Observable<GamepadButtonState | undefined> {
        return this._buttonValue$;
    }

    @Input()
    public set inputFormGroup(formGroup: ControlSchemeBindingInputForm) {
        this._gamepadNameL10nKey$ = formGroup.controls.gamepadId.valueChanges.pipe(
            startWith(formGroup.controls.gamepadId.value),
            switchMap((gamepadId) => this.store.select(GAMEPAD_SELECTORS.selectById(gamepadId))),
            map((gamepad) => gamepad?.nameL10nKey ?? '')
        );

        this._inputMethod$ = formGroup.controls.gamepadInputMethod.valueChanges.pipe(
            startWith(formGroup.controls.gamepadInputMethod.value),
        );

        this._axisConfig$ = formGroup.controls.gamepadInputMethod.valueChanges.pipe(
            startWith(formGroup.controls.gamepadInputMethod.value),
            switchMap((inputMethod) =>
                inputMethod === GamepadInputMethod.Axis
                ? this.store.select(GAMEPAD_SELECTORS.selectAxisConfigByIndex(
                    formGroup.controls.gamepadId.value,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    formGroup.controls.gamepadAxisId.value!
                ))
                : of(undefined)
            )
        );

        this._axisValue$ = formGroup.controls.gamepadInputMethod.valueChanges.pipe(
            startWith(formGroup.controls.gamepadInputMethod.value),
            switchMap((inputMethod) =>
                inputMethod === GamepadInputMethod.Axis
                ? this.store.select(GAMEPAD_AXES_STATE_SELECTORS.selectValueByIndex(
                    formGroup.controls.gamepadId.value,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    formGroup.controls.gamepadAxisId.value!
                ))
                : of(undefined)
            )
        );

        this._buttonConfig$ = formGroup.controls.gamepadInputMethod.valueChanges.pipe(
            startWith(formGroup.controls.gamepadInputMethod.value),
            switchMap((inputMethod) =>
                inputMethod === GamepadInputMethod.Button
                ? this.store.select(GAMEPAD_SELECTORS.selectButtonConfigByIndex(
                    formGroup.controls.gamepadId.value,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    formGroup.controls.gamepadButtonId.value!
                ))
                : of(undefined)
            )
        );

        this._buttonValue$ = formGroup.controls.gamepadInputMethod.valueChanges.pipe(
            startWith(formGroup.controls.gamepadInputMethod.value),
            switchMap((inputMethod) =>
                inputMethod === GamepadInputMethod.Button
                ? this.store.select(GAMEPAD_BUTTONS_STATE_SELECTORS.selectByIndex(
                    formGroup.controls.gamepadId.value,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    formGroup.controls.gamepadButtonId.value!
                ))
                : of(undefined)
            )
        );
    }
}
