import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { Store } from '@ngrx/store';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subject, Subscription, filter, map, switchMap, throttleTime } from 'rxjs';
import { LetDirective, PushPipe } from '@ngrx/component';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { TranslocoModule } from '@ngneat/transloco';
import { MatDividerModule } from '@angular/material/divider';
import {
    CONTROLLER_INPUT_ACTIONS,
    CONTROLLER_INPUT_SELECTORS,
    CONTROLLER_SELECTORS,
    ControllerModel,
    ControllerProfileFactoryService,
    GamepadSettingsModel,
    controllerInputIdFn
} from '@app/store';
import { ControllerInputType, ControllerType, RangeControlComponent, SliderControlComponent, ToFormGroup, ToggleControlComponent } from '@app/shared';

import { IControllerSettingsRenderer } from '../i-controller-settings-renderer';
import { GamepadAxisSettings, GamepadSettings, IControllerProfile } from '../../../controller-profiles';
import { InputOutputDiagramComponent } from './input-output-diagram';
import { ActiveZoneHumanReadableValuePipe } from './active-zone-human-readable-value.pipe';
import { ControlIgnoreInputComponent } from '../control-ignore-input';

type AxisSettingsViewModel = {
    inputId: string;
    activeZoneStartControl: FormControl<number>;
    activeZoneEndControl: FormControl<number>;
    invertControl: FormControl<boolean>;
    name$: Observable<string>;
    rawValue$: Observable<number>;
    outputValue$: Observable<number>;
};

type ViewModel = {
    axes: AxisSettingsViewModel[];
    ignoreInputControl: FormControl<boolean>;
};

type GamepadSettingsForm = FormGroup<{
    controllerId: FormControl<string>;
    controllerType: FormControl<ControllerType.Gamepad>;
    axisConfigs: FormGroup<{ [k in string]: ToFormGroup<GamepadAxisSettings> }>;
    ignoreInput: FormControl<boolean>;
}>;

@Component({
    standalone: true,
    selector: 'app-generic-gamepad-settings',
    templateUrl: './gamepad-settings.component.html',
    styleUrls: [ './gamepad-settings.component.scss' ],
    imports: [
        NgIf,
        JsonPipe,
        LetDirective,
        NgForOf,
        PushPipe,
        MatInputModule,
        MatSliderModule,
        ReactiveFormsModule,
        SliderControlComponent,
        InputOutputDiagramComponent,
        ToggleControlComponent,
        RangeControlComponent,
        TranslocoModule,
        ActiveZoneHumanReadableValuePipe,
        MatDividerModule,
        ControlIgnoreInputComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GamepadSettingsComponent implements IControllerSettingsRenderer<GamepadSettingsModel>, OnInit, OnDestroy {
    private _viewModel?: ViewModel;

    private isCapturingInput = false;

    private formValueChangesSubscription?: Subscription;

    private gamepadSettingsForm?: GamepadSettingsForm;

    private readonly _settingsChanges$ = new Subject<GamepadSettingsModel>();

    constructor(
        private readonly cdRef: ChangeDetectorRef,
        private readonly store: Store,
        private readonly formBuilder: FormBuilder,
        private readonly profileFactoryService: ControllerProfileFactoryService,
    ) {
    }

    public get settingsChanges$(): Observable<GamepadSettingsModel> {
        return this._settingsChanges$;
    }

    public get viewModel(): ViewModel | undefined {
        return this._viewModel;
    }

    public trackAxisByFn(index: number, axis: AxisSettingsViewModel): string {
        return axis.inputId;
    }

    public ngOnInit(): void {
        this.store.dispatch(CONTROLLER_INPUT_ACTIONS.requestInputCapture());
        this.isCapturingInput = true;
    }

    public ngOnDestroy(): void {
        this.formValueChangesSubscription?.unsubscribe();
        if (this.isCapturingInput) {
            this.store.dispatch(CONTROLLER_INPUT_ACTIONS.releaseInputCapture());
        }
    }

    public loadSettings(
        settings: GamepadSettingsModel
    ): void {
        const settingsForm = this.buildSettingsForm(settings);
        const viewModel = this.buildViewModel(settingsForm, settings);

        this.formValueChangesSubscription?.unsubscribe();
        this.formValueChangesSubscription = settingsForm.valueChanges.pipe(
            throttleTime(100, undefined, { trailing: true }),
        ).subscribe(() => {
            const rawValue = this.gamepadSettingsForm?.getRawValue();
            if (rawValue) {
                this._settingsChanges$.next(rawValue);
            }
        });

        this._viewModel = viewModel;
        this.gamepadSettingsForm = settingsForm;
        this.cdRef.detectChanges();
    }

    private buildSettingsForm(
        settings: GamepadSettingsModel
    ): GamepadSettingsForm {
        return this.formBuilder.group({
            controllerId: this.formBuilder.control<string>(settings.controllerId, {
                nonNullable: true,
                validators: [ Validators.required ]
            }),
            controllerType: this.formBuilder.control<ControllerType.Gamepad>(settings.controllerType, { nonNullable: true }),
            axisConfigs: this.formBuilder.group<{ [k in string]: ToFormGroup<GamepadAxisSettings> }>({}),
            ignoreInput: this.formBuilder.control<boolean>(settings.ignoreInput, { nonNullable: true }),
        });
    }

    private buildViewModel(
        form: GamepadSettingsForm,
        settings: GamepadSettingsModel,
    ): ViewModel {
        const controllerState = this.store.select(CONTROLLER_SELECTORS.selectById(settings.controllerId));
        const profile$ = controllerState.pipe(
            filter((cs): cs is ControllerModel => !!cs),
            map(({ profileUid }) => this.profileFactoryService.getByProfileUid(profileUid)),
            filter((profile): profile is IControllerProfile<GamepadSettings> => !!profile),
        );

        const viewModel: ViewModel = {
            axes: [],
            ignoreInputControl: form.controls.ignoreInput,
        };

        for (const [ axisId, axisSettings ] of Object.entries(settings.axisConfigs)) {
            form.controls.axisConfigs.addControl(
                axisId,
                this.formBuilder.group({
                    activeZoneStart: this.formBuilder.control<number>(axisSettings.activeZoneStart, { nonNullable: true }),
                    activeZoneEnd: this.formBuilder.control<number>(axisSettings.activeZoneEnd, { nonNullable: true }),
                    invert: this.formBuilder.control<boolean>(axisSettings.invert, { nonNullable: true }),
                })
            );

            const activeZoneStartControl = form.controls.axisConfigs.controls[axisId].controls.activeZoneStart;
            const activeZoneEndControl = form.controls.axisConfigs.controls[axisId].controls.activeZoneEnd;
            const invertControl = form.controls.axisConfigs.controls[axisId].controls.invert;

            const rawValue$ = this.store.select(CONTROLLER_INPUT_SELECTORS.selectRawValueById(controllerInputIdFn({
                controllerId: settings.controllerId,
                inputId: axisId,
                inputType: ControllerInputType.Axis,
            })));

            const outputValue$ = this.store.select(CONTROLLER_INPUT_SELECTORS.selectValueById(controllerInputIdFn({
                controllerId: settings.controllerId,
                inputId: axisId,
                inputType: ControllerInputType.Axis,
            })));

            viewModel.axes.push({
                inputId: axisId,
                activeZoneStartControl,
                activeZoneEndControl,
                invertControl,
                name$: profile$.pipe(
                    switchMap((profile) => profile.getAxisName$(axisId)),
                ),
                rawValue$,
                outputValue$,
            });
        }
        return viewModel;
    }
}
