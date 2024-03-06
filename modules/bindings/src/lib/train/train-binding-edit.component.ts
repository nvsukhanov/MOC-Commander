import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoPipe } from '@ngneat/transloco';
import { MOTOR_LIMITS } from 'rxpoweredup';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { ControlSchemeBindingType, ValidationMessagesDirective } from '@app/shared-misc';
import { HideOnSmallScreenDirective, ToggleControlComponent } from '@app/shared-ui';
import { BindingControlSelectHubComponent, BindingControlSelectIoComponent } from '@app/shared-control-schemes';
import { TrainBindingInputAction } from '@app/store';

import {
    BindingControlPowerInputComponent,
    BindingControlSelectControllerComponent,
    BindingControlSelectControllerComponentData,
    BindingControlSelectLoopingModeComponent,
    BindingEditSectionComponent,
    BindingEditSectionsContainerComponent,
    CommonBindingsFormControlsBuilderService
} from '../common';
import { IBindingsDetailsEditComponent } from '../i-bindings-details-edit-component';
import { TrainBindingForm } from './train-binding-form';
import { TrainBindingL10nService } from './train-binding-l10n.service';

@Component({
    standalone: true,
    selector: 'lib-cs-binding-train-edit',
    templateUrl: './train-binding-edit.component.html',
    styleUrls: [ './train-binding-edit.component.scss' ],
    imports: [
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
        BindingEditSectionsContainerComponent,
        ValidationMessagesDirective,
        BindingControlPowerInputComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrainBindingEditComponent implements IBindingsDetailsEditComponent<TrainBindingForm> {
    public readonly bindingType = ControlSchemeBindingType.Train;

    private _nextLevelControlBindingComponentData: BindingControlSelectControllerComponentData<ControlSchemeBindingType.Train> | null = null;

    private _prevLevelControlBindingComponentData: BindingControlSelectControllerComponentData<ControlSchemeBindingType.Train> | null = null;

    private _resetControlBindingComponentData: BindingControlSelectControllerComponentData<ControlSchemeBindingType.Train> | null = null;

    private _form?: TrainBindingForm;

    constructor(
        private readonly commonFormControlBuilder: CommonBindingsFormControlsBuilderService,
        private readonly l10nService: TrainBindingL10nService
    ) {
    }

    public get form(): TrainBindingForm | undefined {
        return this._form;
    }

    public get nextLevelControlBindingComponentData(): BindingControlSelectControllerComponentData<ControlSchemeBindingType.Train> | null {
        return this._nextLevelControlBindingComponentData;
    }

    public get prevLevelControlBindingComponentData(): BindingControlSelectControllerComponentData<ControlSchemeBindingType.Train> | null {
        return this._prevLevelControlBindingComponentData;
    }

    public get resetControlBindingComponentData(): BindingControlSelectControllerComponentData<ControlSchemeBindingType.Train> | null {
        return this._resetControlBindingComponentData;
    }

    public setForm(
        form: TrainBindingForm
    ): void {
        this._form = form;
        this._nextLevelControlBindingComponentData = {
            bindingType: ControlSchemeBindingType.Train,
            inputFormGroup: this._form.controls.inputs.controls[TrainBindingInputAction.NextSpeed],
            inputAction: TrainBindingInputAction.NextSpeed,
            inputName$: this.l10nService.getBindingInputName(TrainBindingInputAction.NextSpeed)
        };
        this._prevLevelControlBindingComponentData = {
            bindingType: ControlSchemeBindingType.Train,
            inputFormGroup: this._form.controls.inputs.controls[TrainBindingInputAction.PrevSpeed],
            inputAction: TrainBindingInputAction.PrevSpeed,
            inputName$: this.l10nService.getBindingInputName(TrainBindingInputAction.PrevSpeed)
        };
        this._resetControlBindingComponentData = {
            bindingType: ControlSchemeBindingType.Train,
            inputFormGroup: this._form.controls.inputs.controls[TrainBindingInputAction.Reset],
            inputAction: TrainBindingInputAction.Reset,
            inputName$: this.l10nService.getBindingInputName(TrainBindingInputAction.Reset)
        };
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
        this._form.updateValueAndValidity();
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
        this._form.updateValueAndValidity();
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
        this._form.updateValueAndValidity();
    }
}
