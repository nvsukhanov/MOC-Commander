import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgForOf, NgIf } from '@angular/common';
import { LetDirective, PushPipe } from '@ngrx/component';
import { MatDividerModule } from '@angular/material/divider';
import { TranslocoPipe } from '@ngneat/transloco';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppValidators, ControlSchemeBindingType, getEnumValues } from '@app/shared-misc';
import { BindingTypeToL10nKeyPipe, HideOnSmallScreenDirective } from '@app/shared-ui';
import { ControlSchemeBinding } from '@app/store';

import { BindingEditSectionComponent } from './section';
import { BindingEditDetailsRenderDirective } from './binding-edit-details-render.directive';

@Component({
    standalone: true,
    selector: 'lib-cs-binding-edit',
    templateUrl: './binding-edit.component.html',
    styleUrls: [ './binding-edit.component.scss' ],
    imports: [
        MatCardModule,
        NgIf,
        PushPipe,
        MatDividerModule,
        BindingEditSectionComponent,
        TranslocoPipe,
        LetDirective,
        HideOnSmallScreenDirective,
        MatSelectModule,
        BindingTypeToL10nKeyPipe,
        NgForOf,
        ReactiveFormsModule,
        BindingEditDetailsRenderDirective
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'lib-cs-binding-edit'
})
export class BindingEditComponent {
    @Output() public readonly bindingChange = new EventEmitter<ControlSchemeBinding | null>();

    public readonly availableBindingTypes = getEnumValues(ControlSchemeBindingType);

    protected form = this.formBuilder.group({
        bindingType: this.formBuilder.control<ControlSchemeBindingType>(
            ControlSchemeBindingType.SetSpeed,
            {
                nonNullable: true,
                validators: [
                    Validators.required,
                    AppValidators.isInEnum(ControlSchemeBindingType)
                ]
            }
        )
    });

    private _binding: Partial<ControlSchemeBinding> | undefined;

    constructor(
        private readonly formBuilder: FormBuilder
    ) {
    }

    @Input()
    public set binding(
        binding: Partial<ControlSchemeBinding> | undefined
    ) {
        this._binding = binding;
        this.form.controls.bindingType.patchValue(binding?.bindingType ?? ControlSchemeBindingType.SetSpeed);
    }

    public get binding(): Partial<ControlSchemeBinding> | undefined {
        return this._binding;
    }

    public onBindingChange(binding: ControlSchemeBinding | null): void {
        this.bindingChange.emit(binding);
    }
}
