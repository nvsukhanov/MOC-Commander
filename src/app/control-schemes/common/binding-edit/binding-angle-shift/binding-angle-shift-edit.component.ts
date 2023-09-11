import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { MOTOR_LIMITS, PortModeName } from 'rxpoweredup';
import { Observable, Subscription, mergeWith, of, startWith, switchMap, take } from 'rxjs';
import { PushPipe } from '@ngrx/component';
import { MatDividerModule } from '@angular/material/divider';
import { Store } from '@ngrx/store';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { ControlSchemeBindingType, HideOnSmallScreenDirective, SliderControlComponent, ToggleControlComponent, ValidationMessagesDirective } from '@app/shared';
import { ControlSchemeInputAction, HubFacadeService } from '@app/store';

import {
    BindingControlOutputEndStateComponent,
    BindingControlSelectControllerComponent,
    BindingControlSelectHubComponent,
    BindingControlSelectIoComponent,
    BindingControlSelectLoopingModeComponent
} from '../../controls';
import { IBindingsDetailsEditComponent } from '../i-bindings-details-edit-component';
import { BindingEditSectionComponent } from '../section';
import { BINDING_EDIT_SELECTORS } from '../binding-edit.selectors';
import { BindingEditSectionsContainerComponent } from '../sections-container';
import { ControlSchemeInputActionToL10nKeyPipe } from '../../control-scheme-input-action-to-l10n-key.pipe';
import { AngleShiftBindingForm, CommonFormControlsBuilderService } from '../../forms';

@Component({
    standalone: true,
    selector: 'app-binding-angle-shift-edit',
    templateUrl: './binding-angle-shift-edit.component.html',
    styleUrls: [ './binding-angle-shift-edit.component.scss' ],
    imports: [
        BindingControlSelectControllerComponent,
        MatButtonModule,
        MatIconModule,
        NgForOf,
        NgIf,
        SliderControlComponent,
        ToggleControlComponent,
        TranslocoModule,
        BindingControlOutputEndStateComponent,
        PushPipe,
        ControlSchemeInputActionToL10nKeyPipe,
        BindingControlSelectLoopingModeComponent,
        BindingEditSectionComponent,
        BindingControlSelectHubComponent,
        BindingControlSelectIoComponent,
        MatDividerModule,
        HideOnSmallScreenDirective,
        MatInputModule,
        ReactiveFormsModule,
        BindingEditSectionsContainerComponent,
        ValidationMessagesDirective
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingAngleShiftEditComponent implements IBindingsDetailsEditComponent<AngleShiftBindingForm>, OnDestroy {
    public readonly motorLimits = MOTOR_LIMITS;

    public readonly controlSchemeInputActions = ControlSchemeInputAction;

    public readonly minAngle = -(MOTOR_LIMITS.maxServoDegreesRange / 2);

    public readonly maxAngle = MOTOR_LIMITS.maxServoDegreesRange / 2;

    public readonly bindingType = ControlSchemeBindingType.AngleShift;

    private _form?: AngleShiftBindingForm;

    private _canRequestPortValue$: Observable<boolean> = of(false);

    private portRequestSubscription?: Subscription;

    constructor(
        private readonly commonFormControlBuilder: CommonFormControlsBuilderService,
        private readonly store: Store,
        private readonly changeDetectorRef: ChangeDetectorRef,
        private readonly hubFacade: HubFacadeService
    ) {
    }

    public get form(): AngleShiftBindingForm | undefined {
        return this._form;
    }

    public get canRequestPortValue$(): Observable<boolean> {
        return this._canRequestPortValue$;
    }

    public ngOnDestroy(): void {
        this.portRequestSubscription?.unsubscribe();
    }

    public setForm(
        form: AngleShiftBindingForm
    ): void {
        this._form = form;
        this.portRequestSubscription?.unsubscribe();
        this._canRequestPortValue$ = form.controls.hubId.valueChanges.pipe(
            mergeWith(form.controls.portId.valueChanges),
            startWith(null),
            switchMap(() => {
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
        this.changeDetectorRef.detectChanges();
    }

    public onPortAbsolutePositionRequest(
        levelIndex: number
    ): void {
        this.portRequestSubscription?.unsubscribe();
        if (!this.form || !this.form.controls.hubId.value || !this.form.controls.portId.value) {
            return;
        }
        const control = this.form.controls.angles.at(levelIndex);
        if (!control) {
            return;
        }
        this.portRequestSubscription = this.hubFacade.getMotorAbsolutePosition(
            this.form.controls.hubId.value,
            this.form.controls.portId.value
        ).pipe(
            take(1)
        ).subscribe((position) => {
            control.setValue(position);
        });
    }

    public addNextAngleLevel(): void {
        if (!this.form) {
            return;
        }
        this.form.controls.angles.insert(
            0,
            this.commonFormControlBuilder.angleControl(0)
        );
        this.form.controls.initialStepIndex.setValue(
            this.form.controls.initialStepIndex.value + 1
        );
        this.form.controls.angles.markAsDirty();
        this.form.controls.initialStepIndex.markAsDirty();
        this.form.updateValueAndValidity();
    }

    public addPrevAngleLevel(): void {
        if (!this.form) {
            return;
        }
        this.form.controls.angles.push(
            this.commonFormControlBuilder.angleControl(0)
        );
        this.form.controls.angles.markAsDirty();
        this.form.updateValueAndValidity();
    }

    public removeAngleLevel(
        index: number
    ): void {
        if (!this.form) {
            return;
        }
        this.form.controls.angles.removeAt(index);
        if (this.form.controls.initialStepIndex.value > index) {
            this.form.controls.initialStepIndex.setValue(
                this.form.controls.initialStepIndex.value - 1
            );
        }
        this.form.controls.angles.markAsDirty();
        this.form.controls.initialStepIndex.markAsDirty();
        this.form.updateValueAndValidity();
    }
}