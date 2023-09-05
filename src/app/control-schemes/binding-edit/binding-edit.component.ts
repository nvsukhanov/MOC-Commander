import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { Observable, map, startWith } from 'rxjs';
import { LetDirective, PushPipe } from '@ngrx/component';
import { MatDividerModule } from '@angular/material/divider';
import { TranslocoModule } from '@ngneat/transloco';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BindingTypeToL10nKeyPipe, ControlSchemeBindingType, HideOnSmallScreenDirective } from '@app/shared';
import { ControlSchemeBinding } from '@app/store';

import { ControlSchemeBindingForm, ControlSchemeFormBuilderService, ControlSchemeFormMapperService } from '../common';
import { RenderBindingDetailsEditDirective } from './render-binding-details-edit.directive';
import { BindingControlSelectHubComponent } from './control-select-hub';
import { BindingControlSelectIoComponent } from './control-select-io';
import { BindingEditSectionComponent } from './section';
import { BINDING_EDIT_SELECTORS, BindingTypeSelectViewModel } from './binding-edit.selectors';

@Component({
    standalone: true,
    selector: 'app-binding-edit',
    templateUrl: './binding-edit.component.html',
    styleUrls: [ './binding-edit.component.scss' ],
    imports: [
        MatCardModule,
        NgIf,
        BindingControlSelectHubComponent,
        PushPipe,
        BindingControlSelectIoComponent,
        RenderBindingDetailsEditDirective,
        MatDividerModule,
        BindingEditSectionComponent,
        TranslocoModule,
        LetDirective,
        HideOnSmallScreenDirective,
        MatSelectModule,
        BindingTypeToL10nKeyPipe,
        NgForOf,
        ReactiveFormsModule,
        JsonPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'appBindingEdit'
})
export class BindingEditComponent {
    public readonly canSave$: Observable<boolean>;

    public readonly availableBindingTypes$: Observable<BindingTypeSelectViewModel[]>;

    protected readonly form: ControlSchemeBindingForm;

    constructor(
        private readonly formBuilder: ControlSchemeFormBuilderService,
        private readonly formMapper: ControlSchemeFormMapperService,
        private readonly store: Store,
        private readonly cdRef: ChangeDetectorRef
    ) {
        this.form = this.formBuilder.createBindingForm();

        this.availableBindingTypes$ = this.store.select(BINDING_EDIT_SELECTORS.selectBindingTypeSelectViewModel);

        this.canSave$ = this.form.statusChanges.pipe(
            startWith(null),
            map(() => {
                const isOpModeDirty = this.form.controls.bindingType.dirty;
                const isOpModeValid = this.form.controls.bindingType.valid;
                const isBindingFormDirty = this.form.controls[this.form.controls.bindingType.value].dirty;
                const isBindingFormValid = this.form.controls[this.form.controls.bindingType.value].valid;
                return (isOpModeDirty || isBindingFormDirty) && isOpModeValid && isBindingFormValid;
            })
        );
    }

    @Input()
    public set binding(
        binding: Partial<ControlSchemeBinding> | undefined
    ) {
        if (binding && binding.operationMode !== undefined) {
            this.formBuilder.patchForm(this.form, binding);
            this.cdRef.detectChanges();
        }
    }

    @Input()
    public set bindingType(
        operationMode: ControlSchemeBindingType | undefined
    ) {
        if (operationMode !== undefined) {
            this.form.controls.bindingType.setValue(operationMode);
        }
    }

    public getValue(): ControlSchemeBinding {
        return this.formMapper.mapToModel(this.form);
    }
}
