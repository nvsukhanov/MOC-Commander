import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { Store } from '@ngrx/store';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subscription, combineLatestWith, filter, map, of, startWith, switchMap } from 'rxjs';
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
    GamepadSettingsModel,
    controllerInputIdFn
} from '@app/store';
import { ControllerInputType, ControllerType, RangeControlComponent, SliderControlComponent, ToFormGroup, ToggleControlComponent } from '@app/shared';

import { IControllerSettingsRenderer } from '../i-controller-settings-renderer';
import { ControllerProfileFactoryService, GamepadAxisSettings, GamepadValueTransformService, IControllerProfile } from '../../../../controller-profiles';
import { InputOutputDiagramComponent } from './input-output-diagram';
import { ActiveZoneHumanReadableValuePipe } from './active-zone-human-readable-value.pipe';

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
};

type GamepadSettingsForm = FormGroup<{
    controllerId: FormControl<string>;
    controllerType: FormControl<ControllerType.Gamepad>;
    axisConfigs: FormGroup<{ [k in string]: ToFormGroup<GamepadAxisSettings> }>;
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
        MatDividerModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GamepadSettingsComponent implements IControllerSettingsRenderer<GamepadSettingsModel>, OnInit, OnDestroy {
    public canSave$: Observable<boolean> = of(false);

    private _viewModel?: ViewModel;

    private isCapturingInput = false;

    private formValueChangesSubscription?: Subscription;

    private gamepadSettingsForm?: GamepadSettingsForm;

    constructor(
        private readonly cdRef: ChangeDetectorRef,
        private readonly store: Store,
        private readonly formBuilder: FormBuilder,
        private readonly profileFactoryService: ControllerProfileFactoryService,
        private readonly gamepadValueTransformService: GamepadValueTransformService
    ) {
    }

    public get viewModel(): ViewModel | undefined {
        return this._viewModel;
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
        this.gamepadSettingsForm = this.formBuilder.group({
            controllerId: this.formBuilder.control<string>('', {
                nonNullable: true,
                validators: [ Validators.required ]
            }),
            controllerType: this.formBuilder.control<ControllerType.Gamepad>(ControllerType.Gamepad, { nonNullable: true }),
            axisConfigs: this.formBuilder.group<{ [k in string]: ToFormGroup<GamepadAxisSettings> }>({}),
        });

        this.canSave$ = this.gamepadSettingsForm.valueChanges.pipe(
            startWith(() => this.gamepadSettingsForm?.value),
            map(() => !!(this.gamepadSettingsForm?.dirty && this.gamepadSettingsForm?.valid)),
        );

        this.gamepadSettingsForm.controls.controllerId.setValue(settings.controllerId);
        this.gamepadSettingsForm.controls.controllerType.setValue(settings.controllerType);
        this.gamepadSettingsForm.controls.axisConfigs.reset();
        const controllerState = this.store.select(CONTROLLER_SELECTORS.selectById(settings.controllerId));
        const profile$ = controllerState.pipe(
            filter((cs): cs is ControllerModel => !!cs),
            map(({ profileUid }) => this.profileFactoryService.getByProfileUid(profileUid)),
            filter((profile): profile is IControllerProfile => !!profile),
        );

        const viewModel: ViewModel = {
            axes: []
        };

        for (const [ axisId, axisSettings ] of Object.entries(settings.axisConfigs)) {
            this.gamepadSettingsForm.controls.axisConfigs.addControl(
                axisId,
                this.formBuilder.group({
                    activeZoneStart: this.formBuilder.control<number>(axisSettings.activeZoneStart, { nonNullable: true }),
                    activeZoneEnd: this.formBuilder.control<number>(axisSettings.activeZoneEnd, { nonNullable: true }),
                    invert: this.formBuilder.control<boolean>(axisSettings.invert, { nonNullable: true }),
                })
            );

            const activeZoneStartControl = this.gamepadSettingsForm.controls.axisConfigs.controls[axisId].controls.activeZoneStart;
            const activeZoneEndControl = this.gamepadSettingsForm.controls.axisConfigs.controls[axisId].controls.activeZoneEnd;
            const invertControl = this.gamepadSettingsForm.controls.axisConfigs.controls[axisId].controls.invert;

            const rawValue$ = this.store.select(CONTROLLER_INPUT_SELECTORS.selectValueById(controllerInputIdFn({
                controllerId: settings.controllerId,
                inputId: axisId,
                inputType: ControllerInputType.Axis,
            })));

            const outputValue$ = rawValue$.pipe(
                combineLatestWith(
                    activeZoneStartControl.valueChanges.pipe(startWith(activeZoneStartControl.value)),
                    activeZoneEndControl.valueChanges.pipe(startWith(activeZoneEndControl.value)),
                    invertControl.valueChanges.pipe(startWith(invertControl.value))
                ),
                map(([ rawValue, activeZoneStart, activeZoneEnd, invert ]) => {
                    return this.gamepadValueTransformService.transformAxisValue(rawValue, { activeZoneStart, activeZoneEnd, invert });
                })
            );

            viewModel.axes.push({
                inputId: axisId,
                activeZoneStartControl,
                activeZoneEndControl,
                invertControl,
                name$: profile$.pipe(
                    switchMap((profile) => profile.getAxisName$(axisId)),
                ),
                rawValue$,
                outputValue$
            });
        }

        this._viewModel = viewModel;
        this.cdRef.detectChanges();
    }

    public readSettings(): GamepadSettingsModel | undefined {
        return this.gamepadSettingsForm?.getRawValue();
    }
}
