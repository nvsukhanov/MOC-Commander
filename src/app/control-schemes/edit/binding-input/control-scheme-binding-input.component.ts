import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EMPTY, NEVER, Observable, combineLatest, map, startWith, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { JsonPipe, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { LetDirective, PushPipe } from '@ngrx/component';
import { TranslocoModule } from '@ngneat/transloco';
import { FormControl, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

import { CONTROLLER_INPUT_ACTIONS, CONTROLLER_INPUT_SELECTORS, CONTROLLER_SELECTORS, ControllerInputType, controllerInputIdFn } from '../../../store';
import { ControllerPluginFactoryService } from '../../../plugins';

export type ControlSchemeBindingInputForm = FormGroup<{
    controllerId: FormControl<string>,
    inputId: FormControl<string>,
    inputType: FormControl<ControllerInputType>
}>;

@Component({
    standalone: true,
    selector: 'app-control-scheme-binding-input',
    templateUrl: './control-scheme-binding-input.component.html',
    styleUrls: [ './control-scheme-binding-input.component.scss' ],
    imports: [
        NgSwitch,
        PushPipe,
        JsonPipe,
        LetDirective,
        NgSwitchCase,
        TranslocoModule,
        MatCardModule,
        MatListModule,
        NgIf
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeBindingInputComponent implements OnInit, OnDestroy {
    public readonly inputTypes = ControllerInputType;

    private _controllerNameL10nKey$: Observable<string> = NEVER;

    private _buttonStateL10nKey$: Observable<string> = NEVER;

    private _axisStateL10nKey$: Observable<string> = NEVER;

    private _inputName$: Observable<string> = NEVER;

    private _inputType$: Observable<ControllerInputType> = NEVER;

    private _inputValue$: Observable<{ value: number }> = NEVER;

    constructor(
        private readonly store: Store,
        private readonly controllerPluginFactoryService: ControllerPluginFactoryService
    ) {
    }

    public get controllerNameL10nKey$(): Observable<string> {
        return this._controllerNameL10nKey$;
    }

    public get buttonStateL10nKey$(): Observable<string> {
        return this._buttonStateL10nKey$;
    }

    public get axisStateL10nKey$(): Observable<string> {
        return this._axisStateL10nKey$;
    }

    public get inputName$(): Observable<string> {
        return this._inputName$;
    }

    public get inputValue$(): Observable<{ value: number }> {
        return this._inputValue$;
    }

    public get inputType$(): Observable<ControllerInputType> {
        return this._inputType$;
    }

    @Input()
    public set inputFormGroup(
        formGroup: ControlSchemeBindingInputForm
    ) {
        const controllerId$ = formGroup.controls.controllerId.valueChanges.pipe(
            startWith(formGroup.controls.controllerId.value),
        );
        const controllerPlugin$ = controllerId$.pipe(
            switchMap((controllerId) => this.store.select(CONTROLLER_SELECTORS.selectById(controllerId))),
            map((controller) => this.controllerPluginFactoryService.getPlugin(controller?.controllerType, controller?.id))
        );

        const inputId$ = formGroup.controls.inputId.valueChanges.pipe(
            startWith(formGroup.controls.inputId.value),
        );

        this._inputType$ = formGroup.controls.inputType.valueChanges.pipe(
            startWith(formGroup.controls.inputType.value),
        );

        this._controllerNameL10nKey$ = controllerPlugin$.pipe(
            map((controllerPlugin) => controllerPlugin.nameL10nKey),
        );

        this._inputName$ = combineLatest([
            controllerPlugin$,
            inputId$,
            this._inputType$
        ]).pipe(
            switchMap(([ controllerPlugin, inputId, inputType ]) => {
                switch (inputType) {
                    case ControllerInputType.Axis:
                        return controllerPlugin.getAxisName$(inputId);
                    case ControllerInputType.Button:
                        return controllerPlugin.getButtonName$(inputId);
                    default:
                        return EMPTY;
                }
            })
        );

        this._buttonStateL10nKey$ = controllerPlugin$.pipe(
            map((c) => c.buttonStateL10nKey)
        );

        this._axisStateL10nKey$ = controllerPlugin$.pipe(
            map((c) => c.axisStateL10nKey)
        );

        this._inputValue$ = combineLatest([
            controllerId$,
            inputId$,
            this._inputType$
        ]).pipe(
            switchMap(([ controllerId, inputId, inputType ]) =>
                this.store.select(CONTROLLER_INPUT_SELECTORS.selectValueById(controllerInputIdFn({
                    controllerId,
                    inputId,
                    inputType
                }))),
            ),
            map((value) => ({ value }))
        );
    }

    public ngOnInit(): void {
        this.store.dispatch(CONTROLLER_INPUT_ACTIONS.requestInputCapture());
    }

    public ngOnDestroy(): void {
        this.store.dispatch(CONTROLLER_INPUT_ACTIONS.releaseInputCapture());
    }
}
