import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoPipe } from '@ngneat/transloco';
import { MOTOR_LIMITS } from 'rxpoweredup';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { ControlSchemeBindingType, HideOnSmallScreenDirective, ToggleControlComponent, ValidationMessagesDirective } from '@app/shared';
import { ControlSchemeInputAction } from '@app/store';

import { IBindingsDetailsEditComponent } from '../i-bindings-details-edit-component';
import {
    BindingControlPowerInputComponent,
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
    selector: 'app-binding-speed-shift-edit',
    templateUrl: './binding-speed-shift-edit.component.html',
    styleUrls: [ './binding-speed-shift-edit.component.scss' ],
    imports: [
        NgIf,
        BindingEditSectionComponent,
        BindingControlSelectHubComponent,
        BindingControlSelectIoComponent,
        TranslocoPipe,
        MatDividerModule,
        HideOnSmallScreenDirective,
        BindingControlSelectControllerComponent,
        MatInputModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        BindingControlSelectLoopingModeComponent,
        ToggleControlComponent,
        ControlSchemeInputActionToL10nKeyPipe,
        NgForOf,
        BindingEditSectionsContainerComponent,
        ValidationMessagesDirective,
        BindingControlPowerInputComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingSpeedShiftEditComponent implements IBindingsDetailsEditComponent<SpeedShiftBindingForm> {
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
        this._form.controls.initialLevelIndex.setValue(
            this._form.controls.initialLevelIndex.value + 1
        );
        this._form.controls.initialLevelIndex.markAsDirty();
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
        this._form.controls.initialLevelIndex.markAsDirty();
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
        if (index < this._form.controls.initialLevelIndex.value) {
            this._form.controls.initialLevelIndex.setValue(
                this._form.controls.initialLevelIndex.value - 1
            );
        }
        this._form.controls.initialLevelIndex.markAsDirty();
        this._form.controls.levels.markAsDirty();
        this.changeDetectorRef.detectChanges(); // somehow this is needed to update the view
    }
}
