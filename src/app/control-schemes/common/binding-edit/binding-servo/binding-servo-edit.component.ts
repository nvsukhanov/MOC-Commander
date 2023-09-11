import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { NgIf } from '@angular/common';
import { MOTOR_LIMITS, PortModeName } from 'rxpoweredup';
import { TranslocoModule } from '@ngneat/transloco';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subscription, combineLatestWith, map, mergeWith, of, startWith, switchMap, take } from 'rxjs';
import { PushPipe } from '@ngrx/component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { CONTROL_SCHEME_ACTIONS, ControlSchemeInputAction, HubFacadeService } from '@app/store';
import {
    ControlSchemeBindingType,
    ControllerInputType,
    HideOnSmallScreenDirective,
    SliderControlComponent,
    ToggleControlComponent,
    ValidationMessagesDirective,
    getTranslationArcs
} from '@app/shared';

import { IBindingsDetailsEditComponent } from '../i-bindings-details-edit-component';
import { CalibrationResult, CalibrationResultType, ServoCalibrationDialogComponent } from '../servo-calibration-dialog';
import {
    BindingControlSelectControllerComponent,
    BindingControlSelectHubComponent,
    BindingControlSelectInputGainComponent,
    BindingControlSelectIoComponent
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
        TranslocoModule,
        MatButtonModule,
        MatIconModule,
        PushPipe,
        MatDialogModule,
        SliderControlComponent,
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
        ValidationMessagesDirective
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
        private readonly hubFacade: HubFacadeService
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
            this._form?.controls.aposCenter.setValue(result);
            this._form?.controls.aposCenter.markAsDirty();
            this._form?.controls.aposCenter.markAsTouched();
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
            this._form?.controls.range.setValue(Math.min(Math.abs(cw), Math.abs(ccw)));
            this._form?.controls.range.markAsDirty();
            this._form?.controls.range.markAsTouched();
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
                power: this._form.value.power
            }
        }).afterClosed().subscribe((result: CalibrationResult | null) => {
            this._isCalibrating$.next(false);
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
            this._form = form;
            this.portRequestSubscription?.unsubscribe();

            this._canCalibrate$ = form.controls.hubId.valueChanges.pipe(
                mergeWith(form.controls.portId.valueChanges),
                startWith(null),
                switchMap(() => {
                    if (!form.controls.hubId.value || !form.controls.portId.value) {
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
                    if (!form.controls.hubId.value || !form.controls.portId.value) {
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
