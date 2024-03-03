import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MOTOR_LIMITS, PortModeName } from 'rxpoweredup';
import { TranslocoPipe } from '@ngneat/transloco';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subscription, combineLatestWith, map, mergeWith, of, startWith, switchMap, take } from 'rxjs';
import { PushPipe } from '@ngrx/component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { concatLatestFrom } from '@ngrx/effects';
import { ControllerInputType } from '@app/controller-profiles';
import { ControlSchemeBindingType, ValidationErrorsL10nMap, ValidationMessagesDirective } from '@app/shared-misc';
import { HideOnSmallScreenDirective, ToggleControlComponent } from '@app/shared-ui';
import {
    ATTACHED_IO_PROPS_SELECTORS,
    CONTROL_SCHEME_ACTIONS,
    CalibrationResult,
    CalibrationResultType,
    ControlSchemeInputAction,
    HubMotorPositionFacadeService
} from '@app/store';
import { BindingControlSelectHubComponent, BindingControlSelectIoComponent, MotorPositionAdjustmentComponent } from '@app/shared-control-schemes';

import { ServoCalibrationDialogComponent } from './servo-calibration-dialog';
import {
    BINDING_EDIT_COMMON_SELECTORS,
    BindingControlPowerInputComponent,
    BindingControlSelectControllerComponent,
    BindingControlSelectControllerComponentData,
    BindingControlSelectInputGainComponent,
    BindingControlSpeedInputComponent,
    BindingEditSectionComponent,
    BindingEditSectionsContainerComponent,
    ControlSchemeInputActionToL10nKeyPipe
} from '../common';
import { IBindingsDetailsEditComponent } from '../i-bindings-details-edit-component';
import { BINDING_SERVO_EDIT_SELECTORS } from './binding-servo-edit.selectors';
import { ServoBindingForm } from './servo-binding-form';
import { BINDING_CONTROLLER_NAME_RESOLVER } from '../i-binding-controller-name-resolver';
import { ServoControllerNameResolverService } from './servo-controller-name-resolver.service';
import { NO_INPUTS_ERROR } from './servo-binding-form-builder.service';

@Component({
    standalone: true,
    selector: 'lib-cs-binding-servo-edit',
    templateUrl: './binding-servo-edit.component.html',
    styleUrls: [ './binding-servo-edit.component.scss' ],
    imports: [
        BindingEditSectionComponent,
        TranslocoPipe,
        MatButtonModule,
        MatIconModule,
        PushPipe,
        MatDialogModule,
        ToggleControlComponent,
        BindingControlSelectControllerComponent,
        BindingControlSelectInputGainComponent,
        ControlSchemeInputActionToL10nKeyPipe,
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
        MotorPositionAdjustmentComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        { provide: BINDING_CONTROLLER_NAME_RESOLVER, useClass: ServoControllerNameResolverService }
    ]
})
export class BindingServoEditComponent implements IBindingsDetailsEditComponent<ServoBindingForm>, OnDestroy {
    public readonly validationErrorsMap: ValidationErrorsL10nMap = {
        [NO_INPUTS_ERROR]: 'controlScheme.servoBinding.missingInputs'
    };

    public readonly motorLimits = MOTOR_LIMITS;

    public readonly controlSchemeInputActions = ControlSchemeInputAction;

    public readonly bindingType = ControlSchemeBindingType.Servo;

    private _form?: ServoBindingForm;

    private _canCalibrate$: Observable<boolean> = of(false);

    private _canRequestPortValue$: Observable<boolean> = of(false);

    private _servoCwBindingComponentData?: BindingControlSelectControllerComponentData<ControlSchemeBindingType.Servo>;

    private _servoCcwBindingComponentData?: BindingControlSelectControllerComponentData<ControlSchemeBindingType.Servo>;

    private readonly _isCalibrating$ = new BehaviorSubject(false);

    private portRequestSubscription?: Subscription;

    constructor(
        private readonly cd: ChangeDetectorRef,
        private readonly store: Store,
        private readonly matDialog: MatDialog,
        private readonly hubFacade: HubMotorPositionFacadeService
    ) {
    }

    public get form(): ServoBindingForm | undefined {
        return this._form;
    }

    public get servoCwBindingComponentData(): BindingControlSelectControllerComponentData<ControlSchemeBindingType.Servo> | undefined {
        return this._servoCwBindingComponentData;
    }

    public get servoCcwBindingComponentData(): BindingControlSelectControllerComponentData<ControlSchemeBindingType.Servo> | undefined {
        return this._servoCcwBindingComponentData;
    }

    public get isCwInputGainConfigurable(): boolean {
        const servoInput = this.form?.controls.inputs.controls[ControlSchemeInputAction.ServoCw];
        return servoInput?.controls.inputType.value === ControllerInputType.Axis
            || servoInput?.controls.inputType.value === ControllerInputType.Trigger;
    }

    public get isCcwInputGainConfigurable(): boolean {
        const servoInput = this.form?.controls.inputs.controls[ControlSchemeInputAction.ServoCcw];
        return servoInput?.controls.inputType.value === ControllerInputType.Axis
            || servoInput?.controls.inputType.value === ControllerInputType.Trigger;
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
        this.portRequestSubscription?.unsubscribe();
        this.portRequestSubscription = this.hubFacade.getMotorAbsolutePosition(
            this._form.controls.hubId.value,
            this._form.controls.portId.value
        ).pipe(
            take(1)
        ).subscribe((result: number) => {
            if (this._form && this._form.controls.aposCenter.value !== result) {
                this._form.controls.aposCenter.setValue(result);
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
        const hubId = this._form.controls.hubId.value;
        const portId = this._form.controls.portId.value;
        const formAbsoluteCenterPosition = this._form.controls.aposCenter.value;

        this.portRequestSubscription?.unsubscribe();
        this.portRequestSubscription = this.hubFacade.getMotorPosition(
            this._form.controls.hubId.value,
            this._form.controls.portId.value
        ).pipe(
            concatLatestFrom(() => this.store.select(ATTACHED_IO_PROPS_SELECTORS.selectMotorEncoderOffset({ hubId, portId }))),
            take(1)
        ).subscribe(([currentPosition, offset]) => {
            const formCenterPosition = formAbsoluteCenterPosition - offset;
            const halfArcLength = currentPosition < formCenterPosition
                ? formCenterPosition - currentPosition
                : currentPosition - formCenterPosition;
            const arcLength = halfArcLength * 2;
            const cappedArcLength = Math.min(MOTOR_LIMITS.maxServoDegreesRange, Math.max(-MOTOR_LIMITS.maxServoDegreesRange, arcLength));
            if (this._form && halfArcLength !== this._form.controls.range.value) {
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
                this.store.dispatch(CONTROL_SCHEME_ACTIONS.servoCalibrationError({ error: result.error }));
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
                inputFormGroup: form.controls.inputs.controls[ControlSchemeInputAction.ServoCw],
                inputAction: ControlSchemeInputAction.ServoCw
            };

            this._servoCcwBindingComponentData = {
                bindingType: ControlSchemeBindingType.Servo,
                inputFormGroup: form.controls.inputs.controls[ControlSchemeInputAction.ServoCcw],
                inputAction: ControlSchemeInputAction.ServoCcw
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
                        portModeName: PortModeName.absolutePosition
                    }));
                })
            );
            this.cd.detectChanges();
        }
    }
}
