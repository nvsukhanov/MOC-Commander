import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { NgIf } from '@angular/common';
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
import {
    ControlSchemeBindingType,
    ControllerInputType,
    HideOnSmallScreenDirective,
    ToggleControlComponent,
    ValidationMessagesDirective,
    getTranslationArcs
} from '@app/shared-misc';
import { CONTROL_SCHEME_ACTIONS, CalibrationResult, CalibrationResultType, ControlSchemeInputAction, HubMotorPositionFacadeService } from '@app/store';

import { IBindingsDetailsEditComponent } from '../i-bindings-details-edit-component';
import { ServoCalibrationDialogComponent } from '../servo-calibration-dialog';
import {
    BindingControlPowerInputComponent,
    BindingControlSelectControllerComponent,
    BindingControlSelectHubComponent,
    BindingControlSelectInputGainComponent,
    BindingControlSelectIoComponent,
    BindingControlSpeedInputComponent
} from '../../controls';
import { BINDING_EDIT_SELECTORS } from '../binding-edit.selectors';
import { BindingEditSectionComponent } from '../section';
import { BindingEditSectionsContainerComponent } from '../sections-container';
import { ControlSchemeInputActionToL10nKeyPipe } from '../../control-scheme-input-action-to-l10n-key.pipe';
import { ServoBindingForm } from '../../forms';

@Component({
    standalone: true,
    selector: 'app-binding-servo-edit',
    templateUrl: './binding-servo-edit.component.html',
    styleUrls: [ './binding-servo-edit.component.scss' ],
    imports: [
        NgIf,
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
        BindingControlPowerInputComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingServoEditComponent implements IBindingsDetailsEditComponent<ServoBindingForm>, OnDestroy {
    public readonly motorLimits = MOTOR_LIMITS;

    public readonly controlSchemeInputActions = ControlSchemeInputAction;

    public readonly bindingType = ControlSchemeBindingType.Servo;

    private _form?: ServoBindingForm;

    private _canCalibrate$: Observable<boolean> = of(false);

    private _canRequestPortValue$: Observable<boolean> = of(false);

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

    public get isInputGainConfigurable(): boolean {
        const servoInput = this.form?.controls.inputs.controls[ControlSchemeInputAction.Servo];
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
            const aposCenter = this._form?.controls.aposCenter.value ?? 0;
            const { cw, ccw } = getTranslationArcs(aposCenter, result);
            const nextValue = Math.min(Math.abs(cw), Math.abs(ccw));
            if (this._form && nextValue !== this._form.controls.range.value) {
                this._form.controls.range.setValue(nextValue);
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
            this.portRequestSubscription?.unsubscribe();

            this._canCalibrate$ = form.controls.hubId.valueChanges.pipe(
                mergeWith(form.controls.portId.valueChanges),
                startWith(null),
                switchMap(() => {
                    if (form.controls.hubId.value === null || form.controls.portId.value === null) {
                        return of(false);
                    }
                    return this.store.select(BINDING_EDIT_SELECTORS.canCalibrateServo({
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
                    return this.store.select(BINDING_EDIT_SELECTORS.canRequestPortValue({
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
