import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { IOutputConfigurationRenderer } from '../i-output-configuration-renderer';
import { ControlSchemeBindingOutputForm } from '../../binding-output';
import { NgIf } from '@angular/common';
import { MOTOR_LIMITS } from '@nvsukhanov/rxpoweredup';
import { MatSliderModule } from '@angular/material/slider';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { HUB_ATTACHED_IO_SELECTORS, SERVO_CALIBRATION_ACTIONS } from '../../../../store';
import { Actions, ofType } from '@ngrx/effects';
import { Observable, of, takeUntil } from 'rxjs';
import { PushModule } from '@ngrx/component';

@Component({
    standalone: true,
    selector: 'app-servo-output-configuration-edit',
    templateUrl: './servo-output-configuration-edit.component.html',
    styleUrls: [ './servo-output-configuration-edit.component.scss' ],
    imports: [
        NgIf,
        MatSliderModule,
        ReactiveFormsModule,
        TranslocoModule,
        MatSlideToggleModule,
        MatButtonModule,
        MatIconModule,
        PushModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServoOutputConfigurationEditComponent implements IOutputConfigurationRenderer {
    public readonly motorLimits = MOTOR_LIMITS;

    private _outputBinding?: ControlSchemeBindingOutputForm;

    private _canCalibrate$: Observable<boolean> = of(false);

    constructor(
        private readonly cd: ChangeDetectorRef,
        private readonly store: Store,
        private readonly actions: Actions
    ) {
    }

    public get outputBinding(): ControlSchemeBindingOutputForm | undefined {
        return this._outputBinding;
    }

    public get canCalibrate$(): Observable<boolean> {
        return this._canCalibrate$;
    }

    public calibrate(): void {
        if (!this._outputBinding
            || !this._outputBinding.value
            || this._outputBinding.value.hubId === undefined
            || this._outputBinding.value.portId === undefined
            || this._outputBinding.value.servoConfig?.power === undefined
        ) {
            return;
        }

        this.actions.pipe(
            ofType(SERVO_CALIBRATION_ACTIONS.calibrationFinished),
            takeUntil(
                this.actions.pipe(
                    ofType(SERVO_CALIBRATION_ACTIONS.calibrationError, SERVO_CALIBRATION_ACTIONS.calibrationCancelled)
                )
            )
        ).subscribe((result) => {
            this._outputBinding?.controls.servoConfig.patchValue({
                range: result.range,
                aposCenter: result.aposCenter,
            });
        });

        this.store.dispatch(SERVO_CALIBRATION_ACTIONS.startCalibration({
            hubId: this._outputBinding.value.hubId,
            portId: this._outputBinding.value.portId,
            power: this._outputBinding.value.servoConfig.power
        }));
    }

    public setOutputFormControl(
        outputBinding: ControlSchemeBindingOutputForm
    ): void {
        if (outputBinding !== this._outputBinding) {
            if (outputBinding.value.hubId !== undefined && outputBinding.value.portId !== undefined) {
                this._canCalibrate$ = this.store.select(HUB_ATTACHED_IO_SELECTORS.canCalibrateServo(
                    outputBinding.value.hubId,
                    outputBinding.value.portId
                ));
            } else {
                this._canCalibrate$ = of(false);
            }
            this._outputBinding = outputBinding;
            this.cd.detectChanges();
        }
    }
}
