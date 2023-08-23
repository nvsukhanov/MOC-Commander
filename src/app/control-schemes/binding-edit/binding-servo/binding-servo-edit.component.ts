import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { NgIf } from '@angular/common';
import { MOTOR_LIMITS, PortModeName } from '@nvsukhanov/rxpoweredup';
import { TranslocoModule } from '@ngneat/transloco';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subscription, combineLatest, combineLatestWith, finalize, map, of, startWith, switchMap, take } from 'rxjs';
import { PushPipe } from '@ngrx/component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { concatLatestFrom } from '@ngrx/effects';
import { ATTACHED_IO_PORT_MODE_INFO_SELECTORS, ATTACHED_IO_PROPS_SELECTORS, CONTROL_SCHEME_ACTIONS, HubFacadeService } from '@app/store';
import { ControlSchemeBindingType, ControllerInputType, SliderControlComponent, ToggleControlComponent, getTranslationArcs } from '@app/shared';

import { IBindingsDetailsEditComponent } from '../i-bindings-details-edit-component';
import { CalibrationResult, CalibrationResultType, ServoCalibrationDialogComponent } from '../servo-calibration-dialog';
import { BindingControlSelectControllerComponent } from '../control-select-controller';
import { BINDING_EDIT_SELECTORS } from '../binding-edit.selectors';
import { ServoBindingForm } from '../types';
import { BindingInputGainSelectComponent } from '../control-axial-output-modifier-select';
import { getInputTypesForOperationMode } from '../wait-for-controller-input-dialog/get-io-operation-modes-for-controller-input-type';

@Component({
    standalone: true,
    selector: 'app-binding-servo-edit',
    templateUrl: './binding-servo-edit.component.html',
    styleUrls: [ './binding-servo-edit.component.scss' ],
    imports: [
        NgIf,
        TranslocoModule,
        MatButtonModule,
        MatIconModule,
        PushPipe,
        MatDialogModule,
        SliderControlComponent,
        ToggleControlComponent,
        BindingControlSelectControllerComponent,
        BindingInputGainSelectComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingServoEditComponent implements IBindingsDetailsEditComponent<ServoBindingForm>, OnDestroy {
    public readonly motorLimits = MOTOR_LIMITS;

    public readonly acceptableInputTypes = getInputTypesForOperationMode(ControlSchemeBindingType.Servo);

    private _form?: ServoBindingForm;

    private _canCalibrate$: Observable<boolean> = of(false);

    private readAposCenterSubscription?: Subscription;

    private readServoRangeSubscription?: Subscription;

    private readonly isQueryingPort = new BehaviorSubject<boolean>(false);

    constructor(
        private readonly cd: ChangeDetectorRef,
        private readonly store: Store,
        private readonly matDialog: MatDialog,
        private readonly hubFacadeService: HubFacadeService
    ) {
    }

    public get form(): ServoBindingForm | undefined {
        return this._form;
    }

    public get isInputGainConfigurable(): boolean {
        return this.form?.controls.inputs.controls.servo.controls.inputType.value === ControllerInputType.Axis
            || this.form?.controls.inputs.controls.servo.controls.inputType.value === ControllerInputType.Trigger;
    }

    public get canCalibrate$(): Observable<boolean> {
        return this._canCalibrate$.pipe(
            combineLatestWith(this.isQueryingPort),
            map(([ canCalibrate, isQueryingPort ]) => canCalibrate && !isQueryingPort)
        );
    }

    public get canReadAposFromMotor$(): Observable<boolean> {
        if (!this._form
            || !this._form.value
            || this._form.value.hubId === undefined
            || this._form.value.portId === undefined
        ) {
            return of(false);
        }
        const hubId = this._form.value.hubId;
        const portId = this._form.value.portId;
        return this.store.select(ATTACHED_IO_PROPS_SELECTORS.selectById({ hubId, portId })).pipe(
            concatLatestFrom(() => this.store.select(ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectHubPortHastInputModeForPortModeName({
                hubId,
                portId,
                portModeName: PortModeName.absolutePosition
            }))),
            combineLatestWith(this.isQueryingPort),
            map(([ [ props, hasAbsolutePositionMode ], isQueringPort ]) => !isQueringPort && hasAbsolutePositionMode && !!props),
        );
    }

    public readAposCenterFromMotor(): void {
        if (!this._form
            || !this._form.value
            || this._form.value.hubId === undefined
            || this._form.value.portId === undefined
            || this.isQueryingPort.value
        ) {
            return;
        }
        this.readAposCenterSubscription?.unsubscribe();
        this.isQueryingPort.next(true);
        this.readAposCenterSubscription = this.hubFacadeService.getMotorAbsolutePosition(
            this._form.value.hubId,
            this._form.value.portId
        ).pipe(
            take(1),
            finalize(() => this.isQueryingPort.next(false))
        ).subscribe((apos) => {
            this._form?.controls.aposCenter.setValue(apos);
        });
    }

    public readServoRangeFromMotor(): void {
        if (!this._form
            || !this._form.value
            || this._form.value.hubId === undefined
            || this._form.value.portId === undefined
            || this._form.value.aposCenter === undefined
            || this.isQueryingPort.value
        ) {
            return;
        }
        const aposCenter = this._form.value.aposCenter;
        this.readServoRangeSubscription?.unsubscribe();
        this.isQueryingPort.next(true);
        this.readServoRangeSubscription = this.hubFacadeService.getMotorAbsolutePosition(
            this._form.value.hubId,
            this._form.value.portId
        ).pipe(
            take(1),
            finalize(() => this.isQueryingPort.next(false))
        ).subscribe((apos) => {
            const { cw, ccw } = getTranslationArcs(aposCenter, apos);
            this._form?.controls.range.setValue(Math.min(Math.abs(cw), Math.abs(ccw)));
        });
    }

    public ngOnDestroy(): void {
        this.readAposCenterSubscription?.unsubscribe();
        this.readServoRangeSubscription?.unsubscribe();
    }

    public calibrate(): void {
        if (!this._form
            || !this._form.value
            || this._form.value.hubId === undefined
            || this._form.value.portId === undefined
            || this._form.value.power === undefined
        ) {
            return;
        }
        this.isQueryingPort.next(true);
        this.matDialog.open(ServoCalibrationDialogComponent, {
            data: {
                hubId: this._form.value.hubId,
                portId: this._form.value.portId,
                power: this._form.value.power
            }
        }).afterClosed().subscribe((result: CalibrationResult | null) => {
            this.isQueryingPort.next(false);
            if (!result) { // cancelled
                return;
            }
            if (result.type === CalibrationResultType.finished) {
                this._form?.patchValue({
                    range: result.range,
                    aposCenter: result.aposCenter,
                });
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
            const hubId$ = form.controls.hubId.valueChanges.pipe(
                startWith(form.controls.hubId.value),
                map(() => form.controls.hubId.value),
            );
            const portId$ = form.controls.portId.valueChanges.pipe(
                startWith(form.controls.portId.value),
                map(() => form.controls.portId.value),
            );

            this._canCalibrate$ = combineLatest([
                hubId$,
                portId$
            ]).pipe(
                switchMap(([ hubId, portId ]) => this.store.select(BINDING_EDIT_SELECTORS.canCalibrateServo({ hubId, portId })))
            );
            this._form = form;
            this.cd.detectChanges();
        }
    }
}
