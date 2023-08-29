import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { MOTOR_LIMITS, PortModeName } from '@nvsukhanov/rxpoweredup';
import { TranslocoModule } from '@ngneat/transloco';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, combineLatest, combineLatestWith, map, of, startWith, switchMap } from 'rxjs';
import { PushPipe } from '@ngrx/component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CONTROL_SCHEME_ACTIONS, ControlSchemeInputAction } from '@app/store';
import { ControllerInputType, SliderControlComponent, ToggleControlComponent, getTranslationArcs } from '@app/shared';

import { IBindingsDetailsEditComponent } from '../i-bindings-details-edit-component';
import { CalibrationResult, CalibrationResultType, ServoCalibrationDialogComponent } from '../servo-calibration-dialog';
import { BindingControlSelectControllerComponent } from '../control-select-controller';
import { BINDING_EDIT_SELECTORS } from '../binding-edit.selectors';
import { ServoBindingForm } from '../types';
import { BindingInputGainSelectComponent } from '../control-axial-output-modifier-select';
import { BindingControlReadMotorPositionComponent } from '../control-read-pos';
import { ControlSchemeInputActionToL10nKeyPipe } from '../../control-scheme-input-action-to-l10n-key.pipe';

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
        BindingInputGainSelectComponent,
        BindingControlReadMotorPositionComponent,
        ControlSchemeInputActionToL10nKeyPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingServoEditComponent implements IBindingsDetailsEditComponent<ServoBindingForm> {
    public readonly motorLimits = MOTOR_LIMITS;

    public readonly controlSchemeInputActions = ControlSchemeInputAction;

    public readonly portModeNames = PortModeName;

    private _form?: ServoBindingForm;

    private _canCalibrate$: Observable<boolean> = of(false);

    private readonly isQueryingPort = new BehaviorSubject<boolean>(false);

    constructor(
        private readonly cd: ChangeDetectorRef,
        private readonly store: Store,
        private readonly matDialog: MatDialog,
    ) {
    }

    public get form(): ServoBindingForm | undefined {
        return this._form;
    }

    public get isInputGainConfigurable(): boolean {
        const servoInput = this.form?.controls.inputs.controls[ControlSchemeInputAction.Servo];
        return servoInput?.controls.inputType.value === ControllerInputType.Axis
            || servoInput?.controls.inputType.value === ControllerInputType.Trigger;
    }

    public get canCalibrate$(): Observable<boolean> {
        return this._canCalibrate$.pipe(
            combineLatestWith(this.isQueryingPort),
            map(([ canCalibrate, isQueryingPort ]) => canCalibrate && !isQueryingPort)
        );
    }

    public get canQueryPort$(): Observable<boolean> {
        if (!this._form
            || !this._form.value
            || this._form.value.hubId === undefined
            || this._form.value.portId === undefined
        ) {
            return of(false);
        }
        return this.isQueryingPort.pipe(
            map((isQueryingPort) => !isQueryingPort)
        );
    }

    public updateIsQueryingPort(
        isQueryingPort: boolean
    ): void {
        this.isQueryingPort.next(isQueryingPort);
    }

    public aposCenterFromMotorChanged(
        aposCenter: number
    ): void {
        this._form?.controls.aposCenter.setValue(aposCenter);
        this._form?.controls.aposCenter.markAsDirty();
        this._form?.controls.aposCenter.markAsTouched();
    }

    public rangeFromMotorChanged(
        result: number
    ): void {
        const aposCenter = this._form?.controls.aposCenter.value ?? 0;
        const { cw, ccw } = getTranslationArcs(aposCenter, result);
        this._form?.controls.range.setValue(Math.min(Math.abs(cw), Math.abs(ccw)));
        this._form?.controls.range.markAsDirty();
        this._form?.controls.range.markAsTouched();
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
