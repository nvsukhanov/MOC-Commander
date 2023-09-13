import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { MOTOR_LIMITS } from 'rxpoweredup';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { ControlSchemeBindingType, HideOnSmallScreenDirective, SliderControlComponent, ToggleControlComponent, ValidationMessagesDirective } from '@app/shared';
import { ControlSchemeInputAction } from '@app/store';

import { IBindingsDetailsEditComponent } from '../i-bindings-details-edit-component';
import {
    BindingControlSelectControllerComponent,
    BindingControlSelectHubComponent,
    BindingControlSelectIoComponent,
    BindingControlSelectLoopingModeComponent
} from '../../controls';
import { BindingEditSectionComponent } from '../section';
import { BindingEditSectionsContainerComponent } from '../sections-container';
import { ControlSchemeInputActionToL10nKeyPipe } from '../../control-scheme-input-action-to-l10n-key.pipe';
import { CommonFormControlsBuilderService, SpeedShiftBindingForm } from '../../forms';

@Component({
    standalone: true,
    selector: 'app-binding-speed-stepper',
    templateUrl: './binding-speed-shift.component.html',
    styleUrls: [ './binding-speed-shift.component.scss' ],
    imports: [
        NgIf,
        BindingEditSectionComponent,
        BindingControlSelectHubComponent,
        BindingControlSelectIoComponent,
        TranslocoModule,
        MatDividerModule,
        HideOnSmallScreenDirective,
        BindingControlSelectControllerComponent,
        MatInputModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        SliderControlComponent,
        BindingControlSelectLoopingModeComponent,
        ToggleControlComponent,
        ControlSchemeInputActionToL10nKeyPipe,
        NgForOf,
        BindingEditSectionsContainerComponent,
        ValidationMessagesDirective
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingSpeedShiftComponent implements IBindingsDetailsEditComponent<SpeedShiftBindingForm> {
    public readonly motorLimits = MOTOR_LIMITS;

    public readonly bindingType = ControlSchemeBindingType.SpeedShift;

    public readonly controlSchemeInputActions = ControlSchemeInputAction;

    private _form?: SpeedShiftBindingForm;

    constructor(
        private readonly commonFormControlBuilder: CommonFormControlsBuilderService,
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {
    }

    public get form(): SpeedShiftBindingForm | undefined {
        return this._form;
    }

    public setForm(
        form: SpeedShiftBindingForm
    ): void {
        this._form = form;
    }

    public addNextSpeedControl(): void {
        if (!this._form) {
            return;
        }
        this._form.controls.levels.insert(
            0,
            this.commonFormControlBuilder.speedLevelControl(MOTOR_LIMITS.maxSpeed)
        );
        this._form.controls.initialStepIndex.setValue(
            this._form.controls.initialStepIndex.value + 1
        );
        this._form.controls.initialStepIndex.markAsDirty();
        this._form.controls.levels.markAsDirty();
        this.changeDetectorRef.detectChanges(); // somehow this is needed to update the view
    }

    public addPrevSpeedControl(): void {
        if (!this._form) {
            return;
        }
        this._form.controls.levels.push(
            this.commonFormControlBuilder.speedLevelControl(MOTOR_LIMITS.minSpeed)
        );
        this._form.controls.initialStepIndex.markAsDirty();
        this._form.controls.levels.markAsDirty();
        this.changeDetectorRef.detectChanges(); // somehow this is needed to update the view
    }

    public removeSpeedControl(
        index: number
    ): void {
        if (!this._form) {
            return;
        }
        this._form.controls.levels.removeAt(index);
        if (index < this._form.controls.initialStepIndex.value) {
            this._form.controls.initialStepIndex.setValue(
                this._form.controls.initialStepIndex.value - 1
            );
        }
        this._form.controls.initialStepIndex.markAsDirty();
        this._form.controls.levels.markAsDirty();
        this.changeDetectorRef.detectChanges(); // somehow this is needed to update the view
    }
}
