import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { MatButtonModule } from '@angular/material/button';
import { Observable, map, startWith } from 'rxjs';
import { IoOperationTypeToL10nKeyPipe } from '@app/shared';
import { ControlSchemeBinding } from '@app/store';

import { ControlSchemeFormBuilderService } from './form-builders';
import { RenderBindingDetailsEditDirective } from './render-binding-details-edit.directive';
import { BindingControlSelectOperationModeComponent } from './control-select-operation-mode';
import { BindingControlSelectHubComponent } from './control-select-hub';
import { BindingControlSelectIoComponent } from './control-select-io';
import { BindingEditAvailableOperationModesModel, ControlSchemeBindingForm } from './types';

@Component({
    standalone: true,
    selector: 'app-binding',
    templateUrl: './binding-edit.component.html',
    styleUrls: [ './binding-edit.component.scss' ],
    imports: [
        MatCardModule,
        NgIf,
        IoOperationTypeToL10nKeyPipe,
        TranslocoModule,
        NgForOf,
        BindingControlSelectOperationModeComponent,
        BindingControlSelectHubComponent,
        BindingControlSelectIoComponent,
        MatButtonModule,
        RenderBindingDetailsEditDirective,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'appBindingEdit'
})
export class BindingEditComponent {
    @Input() public availabilityData: BindingEditAvailableOperationModesModel = {};

    public readonly canSave$: Observable<boolean>;

    protected readonly form: ControlSchemeBindingForm;

    constructor(
        private readonly formBuilder: ControlSchemeFormBuilderService
    ) {
        this.form = this.formBuilder.createBindingForm();
        this.canSave$ = this.form.statusChanges.pipe(
            startWith(null),
            map(() => {
                const isOpModeDirty = this.form.controls.bindingFormOperationMode.dirty;
                const isOpModeValid = this.form.controls.bindingFormOperationMode.valid;
                const isBindingFormDirty = this.form.controls[this.form.controls.bindingFormOperationMode.value].dirty;
                const isBindingFormValid = this.form.controls[this.form.controls.bindingFormOperationMode.value].valid;
                return (isOpModeDirty || isBindingFormDirty) && isOpModeValid && isBindingFormValid;
            })
        );
    }

    @Input()
    public set binding(
        binding: ControlSchemeBinding | undefined
    ) {
        if (binding) {
            this.form.controls.bindingFormOperationMode.setValue(binding.operationMode);
            this.form.controls[binding.operationMode].patchValue(binding);
        }
    }

    public getValue(): ControlSchemeBinding {
        const rawData = this.form.getRawValue();
        const bindingData: Omit<ControlSchemeBinding, 'operationMode'> = rawData[rawData.bindingFormOperationMode];
        return {
            operationMode: rawData.bindingFormOperationMode,
            ...bindingData
        } as ControlSchemeBinding;
    }
}
