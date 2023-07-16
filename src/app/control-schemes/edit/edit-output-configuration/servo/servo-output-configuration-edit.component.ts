import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { MOTOR_LIMITS } from '@nvsukhanov/rxpoweredup';
import { TranslocoModule } from '@ngneat/transloco';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, of, startWith, switchMap } from 'rxjs';
import { PushPipe } from '@ngrx/component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CONTROL_SCHEME_ACTIONS } from '@app/store';

import { ControlSchemeBindingOutputForm } from '../../binding-output';
import { IOutputConfigurationRenderer } from '../i-output-configuration-renderer';
import { CalibrationResult, CalibrationResultType, ServoCalibrationDialogComponent } from '../../servo-calibration-dialog';
import { OutputConfigSliderControlComponent, OutputConfigToggleControlComponent } from '../controls';
import { CONTROL_SCHEME_EDIT_SELECTORS } from '../../control-scheme-edit.selectors';

@Component({
    standalone: true,
    selector: 'app-servo-output-configuration-edit',
    templateUrl: './servo-output-configuration-edit.component.html',
    styleUrls: [ './servo-output-configuration-edit.component.scss' ],
    imports: [
        NgIf,
        TranslocoModule,
        MatButtonModule,
        MatIconModule,
        PushPipe,
        MatDialogModule,
        OutputConfigSliderControlComponent,
        OutputConfigToggleControlComponent
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
        private readonly matDialog: MatDialog
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
        this.matDialog.open(ServoCalibrationDialogComponent, {
            data: {
                hubId: this._outputBinding.value.hubId,
                portId: this._outputBinding.value.portId,
                power: this._outputBinding.value.servoConfig.power
            }
        }).afterClosed().subscribe((result: CalibrationResult | null) => {
            if (!result) { // cancelled
                return;
            }
            if (result.type === CalibrationResultType.finished) {
                this._outputBinding?.controls.servoConfig.patchValue({
                    range: result.range,
                    aposCenter: result.aposCenter,
                });
            }
            if (result.type === CalibrationResultType.error) {
                this.store.dispatch(CONTROL_SCHEME_ACTIONS.servoCalibrationError({ error: result.error }));
            }
        });
    }

    public setOutputFormControl(
        outputBinding: ControlSchemeBindingOutputForm
    ): void {
        if (outputBinding !== this._outputBinding) {
            const hubId$ = outputBinding.controls.hubId.valueChanges.pipe(
                startWith(outputBinding.controls.hubId.value),
            );
            const portId$ = outputBinding.controls.portId.valueChanges.pipe(
                startWith(outputBinding.controls.portId.value),
            );

            this._canCalibrate$ = combineLatest([
                hubId$,
                portId$
            ]).pipe(
                switchMap(([ hubId, portId ]) => this.store.select(CONTROL_SCHEME_EDIT_SELECTORS.canCalibrateServo({ hubId, portId })))
            );
            this._outputBinding = outputBinding;
            this.cd.detectChanges();
        }
    }
}
