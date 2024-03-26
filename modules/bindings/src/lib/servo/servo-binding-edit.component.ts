import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { PortModeName } from 'rxpoweredup';
import { TranslocoPipe } from '@ngneat/transloco';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subscription, combineLatestWith, map, mergeWith, of, startWith, switchMap, take } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { concatLatestFrom } from '@ngrx/effects';
import { AsyncPipe } from '@angular/common';
import { ControlSchemeBindingType, ValidationErrorsL10nMap, ValidationMessagesDirective, transformRelativeDegToAbsoluteDeg } from '@app/shared-misc';
import { HideOnSmallScreenDirective, ToggleControlComponent } from '@app/shared-components';
import {
    ATTACHED_IO_PROPS_SELECTORS,
    CalibrationResult,
    CalibrationResultType,
    HubMotorPositionFacadeService,
    InputPipeType,
    OutOfRangeCalibrationError,
    SHOW_NOTIFICATION_ACTIONS,
    ServoBindingInputAction
} from '@app/store';
import { BindingControlSelectHubComponent, BindingControlSelectIoComponent, MotorPositionAdjustmentComponent } from '@app/shared-control-schemes';

import { ServoCalibrationDialogComponent } from './servo-calibration-dialog';
import {
    BINDING_EDIT_COMMON_SELECTORS,
    BindingControlPowerInputComponent,
    BindingControlSelectControllerComponent,
    BindingControlSelectControllerComponentData,
    BindingControlSpeedInputComponent,
    BindingEditSectionComponent,
    BindingEditSectionsContainerComponent
} from '../common';
import { IBindingsDetailsEditComponent } from '../i-bindings-details-edit-component';
import { BINDING_SERVO_EDIT_SELECTORS } from './binding-servo-edit.selectors';
import { ServoBindingForm } from './servo-binding-form';
import { NO_INPUTS_SERVO_ERROR, ServoBindingFormBuilderService } from './servo-binding-form-builder.service';
import { ServoBindingL10nService } from './servo-binding-l10n.service';

@Component({
    standalone: true,
    selector: 'lib-cs-servo-binding-edit',
    templateUrl: './servo-binding-edit.component.html',
    styleUrls: [ './servo-binding-edit.component.scss' ],
    imports: [
        BindingEditSectionComponent,
        TranslocoPipe,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        ToggleControlComponent,
        BindingControlSelectControllerComponent,
        BindingControlSelectHubComponent,
        BindingControlSelectIoComponent,
        MatDividerModule,
        MatInputModule,
        ReactiveFormsModule,
        HideOnSmallScreenDirective,
        BindingEditSectionsContainerComponent,
        ValidationMessagesDirective,
        BindingControlSpeedInputComponent,
        BindingControlPowerInputComponent,
        MotorPositionAdjustmentComponent,
        AsyncPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServoBindingEditComponent implements IBindingsDetailsEditComponent<ServoBindingForm>, OnDestroy {
    public readonly validationErrorsMap: ValidationErrorsL10nMap = {
        [NO_INPUTS_SERVO_ERROR]: 'controlScheme.servoBinding.missingInputs'
    };

    public readonly bindingType = ControlSchemeBindingType.Servo;

    private _form?: ServoBindingForm;

    private _canCalibrate$: Observable<boolean> = of(false);

    private _canRequestPortValue$: Observable<boolean> = of(false);

    private _servoCwBindingComponentData: BindingControlSelectControllerComponentData<ControlSchemeBindingType.Servo> | null = null;

    private _servoCcwBindingComponentData: BindingControlSelectControllerComponentData<ControlSchemeBindingType.Servo> | null = null;

    private readonly _isCalibrating$ = new BehaviorSubject(false);

    private portRequestSubscription?: Subscription;

    private centerReadPositionResult: number | null = null;

    constructor(
        private readonly cd: ChangeDetectorRef,
        private readonly store: Store,
        private readonly matDialog: MatDialog,
        private readonly hubFacade: HubMotorPositionFacadeService,
        protected readonly formBuilder: ServoBindingFormBuilderService,
        private readonly l10nService: ServoBindingL10nService
    ) {
    }

    public get form(): ServoBindingForm | undefined {
        return this._form;
    }

    public get servoCwBindingComponentData(): BindingControlSelectControllerComponentData<ControlSchemeBindingType.Servo> | null {
        return this._servoCwBindingComponentData;
    }

    public get servoCcwBindingComponentData(): BindingControlSelectControllerComponentData<ControlSchemeBindingType.Servo> | null {
        return this._servoCcwBindingComponentData;
    }

    public get isCenterPositionReceived(): boolean {
        return this.centerReadPositionResult !== null;
    }

    public get canCalibrate$(): Observable<boolean> {
        return this._canCalibrate$.pipe(
            combineLatestWith(this._isCalibrating$),
            map(([ canCalibrate, isCalibrating ]) => canCalibrate && !isCalibrating)
        );
    }

    public get canRequestPortValue$(): Observable<boolean> {
        return this._canRequestPortValue$;
    }

    public ngOnDestroy(): void {
        this.portRequestSubscription?.unsubscribe();
    }

    public onServoCenterReadRequest(): void {
        if (!this._form || this._form.controls.hubId.value === null || this._form.controls.portId.value === null) {
            return;
        }
        const hubId = this._form.controls.hubId.value;
        const portId = this._form.controls.portId.value;
        this.centerReadPositionResult = null;

        this.portRequestSubscription?.unsubscribe();
        this.portRequestSubscription = this.hubFacade.getMotorPosition(
            this._form.controls.hubId.value,
            this._form.controls.portId.value
        ).pipe(
            concatLatestFrom(() => this.store.select(ATTACHED_IO_PROPS_SELECTORS.selectMotorEncoderOffset({ hubId, portId }))),
            take(1)
        ).subscribe(([position, offset]) => {
            // we temporarily store the result to use it later in the range read request
            this.centerReadPositionResult = position;
            const absolutePosition = transformRelativeDegToAbsoluteDeg(position + offset);
            if (this._form && this._form.controls.aposCenter.value !== absolutePosition) {
                this._form.controls.aposCenter.setValue(absolutePosition);
                this._form.controls.aposCenter.markAsDirty();
                this._form.controls.aposCenter.markAsTouched();
                this._form.updateValueAndValidity();
            }
        });
    }

    public onServoRangeReadRequest(): void {
        if (!this._form
            || this._form.controls.hubId.value === null
            || this._form.controls.portId.value === null
            || this._form.controls.aposCenter.value == null
        ) {
            return;
        }

        this.portRequestSubscription?.unsubscribe();
        this.portRequestSubscription = this.hubFacade.getMotorPosition(
            this._form.controls.hubId.value,
            this._form.controls.portId.value
        ).pipe(
            take(1)
        ).subscribe((currentPosition) => {
            if (this.centerReadPositionResult === null) {
                return;
            }
            const arcLength = Math.abs(currentPosition - this.centerReadPositionResult) * 2;
            const cappedArcLength = Math.min(this.formBuilder.servoMaxRange, Math.max(this.formBuilder.servoMinRange, arcLength));
            if (this._form && cappedArcLength !== this._form.controls.range.value) {
                this._form.controls.range.setValue(cappedArcLength);
                this._form.controls.range.markAsDirty();
                this._form.controls.range.markAsTouched();
                this._form.updateValueAndValidity();
            }
        });
    }

    public calibrate(): void {
        if (!this._form) {
            return;
        }
        this._isCalibrating$.next(true);
        this.matDialog.open(ServoCalibrationDialogComponent, {
            data: {
                hubId: this._form.value.hubId,
                portId: this._form.value.portId,
                speed: this._form.value.speed,
                power: this._form.value.power
            }
        }).afterClosed().subscribe((result: CalibrationResult | null) => {
            this._isCalibrating$.next(false);
            if (!result) { // cancelled
                return;
            }
            if (result.type === CalibrationResultType.finished) {
                if (!this._form) {
                    return;
                }
                if (this._form.controls.aposCenter.value !== result.aposCenter) {
                    this._form.controls.aposCenter.setValue(result.aposCenter);
                    this._form.controls.aposCenter.markAsDirty();
                    this._form.controls.aposCenter.markAsTouched();
                }
                if (this._form.controls.range.value !== result.range) {
                    this._form.controls.range.setValue(result.range);
                    this._form.controls.range.markAsDirty();
                    this._form.controls.range.markAsTouched();
                }
                this._form.updateValueAndValidity();
            }
            if (result.type === CalibrationResultType.error) {
                const errorL10nKey = result.error instanceof OutOfRangeCalibrationError
                    ? 'controlScheme.servoBinding.calibrationOutOfRangeError'
                    : 'controlScheme.servoBinding.calibrationError';
                this.store.dispatch(SHOW_NOTIFICATION_ACTIONS.error({ l10nKey: errorL10nKey }));
            }
        });
    }

    public setForm(
        form: ServoBindingForm
    ): void {
        if (form !== this._form) {
            this._form = form;

            this._servoCwBindingComponentData = {
                bindingType: ControlSchemeBindingType.Servo,
                inputFormGroup: form.controls.inputs.controls[ServoBindingInputAction.Cw],
                inputAction: ServoBindingInputAction.Cw,
                inputName$: this.l10nService.getBindingInputName(ServoBindingInputAction.Cw),
                supportedInputPipes: [ InputPipeType.ExponentialGain, InputPipeType.LogarithmicGain, InputPipeType.OnOffToggle ]
            };

            this._servoCcwBindingComponentData = {
                bindingType: ControlSchemeBindingType.Servo,
                inputFormGroup: form.controls.inputs.controls[ServoBindingInputAction.Ccw],
                inputAction: ServoBindingInputAction.Ccw,
                inputName$: this.l10nService.getBindingInputName(ServoBindingInputAction.Ccw),
                supportedInputPipes: [ InputPipeType.ExponentialGain, InputPipeType.LogarithmicGain, InputPipeType.OnOffToggle ]
            };

            this.portRequestSubscription?.unsubscribe();

            this._canCalibrate$ = form.controls.hubId.valueChanges.pipe(
                mergeWith(form.controls.portId.valueChanges),
                startWith(null),
                switchMap(() => {
                    if (form.controls.hubId.value === null || form.controls.portId.value === null) {
                        return of(false);
                    }
                    return this.store.select(BINDING_SERVO_EDIT_SELECTORS.canCalibrateServo({
                        hubId: form.controls.hubId.value,
                        portId: form.controls.portId.value,
                    }));
                })
            );

            this._canRequestPortValue$ = form.controls.hubId.valueChanges.pipe(
                mergeWith(form.controls.portId.valueChanges),
                startWith(null),
                combineLatestWith(this._isCalibrating$),
                switchMap(([ , isCalibrating ]) => {
                    if (isCalibrating) {
                        return of(false);
                    }
                    if (form.controls.hubId.value === null || form.controls.portId.value === null) {
                        return of(false);
                    }
                    return this.store.select(BINDING_EDIT_COMMON_SELECTORS.canRequestPortValue({
                        hubId: form.controls.hubId.value,
                        portId: form.controls.portId.value,
                        portModeName: PortModeName.position
                    }));
                })
            );
            this.cd.detectChanges();
        }
    }
}
