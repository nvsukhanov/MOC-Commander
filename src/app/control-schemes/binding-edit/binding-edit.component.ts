import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgForOf, NgIf } from '@angular/common';
import { Observable, map, of, startWith } from 'rxjs';
import { LetDirective, PushPipe } from '@ngrx/component';
import { MatDividerModule } from '@angular/material/divider';
import { TranslocoModule } from '@ngneat/transloco';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BindingTypeToL10nKeyPipe, HideOnSmallScreenDirective } from '@app/shared';
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
        ReactiveFormsModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'appBindingEdit'
})
export class BindingEditComponent {
    public readonly availableBindingTypes$: Observable<BindingTypeSelectViewModel[]>;

    private _canSave$: Observable<boolean> = of(false);

    private _form?: ControlSchemeBindingForm;

    constructor(
        private readonly formBuilder: ControlSchemeFormBuilderService,
        private readonly formMapper: ControlSchemeFormMapperService,
        private readonly store: Store
    ) {
        this.availableBindingTypes$ = this.store.select(BINDING_EDIT_SELECTORS.selectBindingTypeSelectViewModel);
    }

    @Input()
    public set binding(
        binding: Partial<ControlSchemeBinding> | undefined
    ) {
        if (binding) {
            const form = this.formBuilder.createBindingForm();

            this.formBuilder.patchForm(form, binding);

            this._canSave$ = form.statusChanges.pipe(
                startWith(null),
                map(() => {
                    const isOpModeDirty = form.controls.bindingType.dirty;
                    const isOpModeValid = form.controls.bindingType.valid;
                    const isBindingFormDirty = form.controls[form.controls.bindingType.value].dirty;
                    const isBindingFormValid = form.controls[form.controls.bindingType.value].valid;
                    return (isOpModeDirty || isBindingFormDirty) && isOpModeValid && isBindingFormValid;
                })
            );
            this._form = form;
        } else {
            this._form = undefined;
            this._canSave$ = of(false);
        }
    }

    public get form(): ControlSchemeBindingForm | undefined {
        return this._form;
    }

    public get canSave$(): Observable<boolean> {
        return this._canSave$;
    }

    public getValue(): ControlSchemeBinding {
        if (!this._form) {
            throw new Error('BindingEditComponent: form is not initialized');
        }
        return this.formMapper.mapToModel(this._form);
    }
}
