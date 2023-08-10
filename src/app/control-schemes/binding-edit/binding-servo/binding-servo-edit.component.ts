import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { MOTOR_LIMITS } from '@nvsukhanov/rxpoweredup';
import { TranslocoModule } from '@ngneat/transloco';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, map, of, startWith, switchMap } from 'rxjs';
import { PushPipe } from '@ngrx/component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CONTROL_SCHEME_ACTIONS } from '@app/store';
import { ControllerInputType, HubIoOperationMode, SliderControlComponent, ToggleControlComponent } from '@app/shared';

import { IBindingsDetailsEditComponent } from '../i-bindings-details-edit-component';
import { CalibrationResult, CalibrationResultType, ServoCalibrationDialogComponent } from '../servo-calibration-dialog';
import { BindingControlSelectControllerComponent } from '../control-select-controller';
import { BINDING_EDIT_SELECTORS } from '../binding-edit.selectors';
import { ServoBindingForm } from '../types';
import { BindingInputGainSelectComponent } from '../control-axial-output-modifier-select';

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
export class BindingServoEditComponent implements IBindingsDetailsEditComponent<ServoBindingForm> {
    public readonly motorLimits = MOTOR_LIMITS;

    public readonly servoOperationMode = HubIoOperationMode.Servo;

    private _form?: ServoBindingForm;

    private _canCalibrate$: Observable<boolean> = of(false);

    constructor(
        private readonly cd: ChangeDetectorRef,
        private readonly store: Store,
        private readonly matDialog: MatDialog
    ) {
    }

    public get form(): ServoBindingForm | undefined {
        return this._form;
    }

    public get isInputGainConfigurable(): boolean {
        return this.form?.controls.inputType.value === ControllerInputType.Axis
            || this.form?.controls.inputType.value === ControllerInputType.Trigger;
    }

    public get canCalibrate$(): Observable<boolean> {
        return this._canCalibrate$;
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
        this.matDialog.open(ServoCalibrationDialogComponent, {
            data: {
                hubId: this._form.value.hubId,
                portId: this._form.value.portId,
                power: this._form.value.power
            }
        }).afterClosed().subscribe((result: CalibrationResult | null) => {
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
