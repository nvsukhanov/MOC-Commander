import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ValidationErrorMappingDirective, ValidationErrorsL10nMap } from '@app/shared';

import { CONTROL_SCHEME_NAME_IS_NOT_UNIQUE, ControlSchemeValidators } from '../../validation';

@Component({
    standalone: true,
    selector: 'app-control-scheme-create-dialog',
    templateUrl: './control-scheme-create-dialog.component.html',
    styleUrls: [ './control-scheme-create-dialog.component.scss' ],
    imports: [
        MatDialogModule,
        MatInputModule,
        ReactiveFormsModule,
        MatButtonModule,
        TranslocoModule,
        ValidationErrorMappingDirective,
        MatFormFieldModule,
        NgIf,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeCreateDialogComponent {
    protected readonly nameFormControl: FormControl<string>;

    protected readonly validationErrorsL10nMap: ValidationErrorsL10nMap = {
        required: 'controlScheme.newSchemeDialogNameRequired',
        [CONTROL_SCHEME_NAME_IS_NOT_UNIQUE]: 'controlScheme.newSchemeDialogNameUniqueness'
    };

    constructor(
        private readonly dialogRef: MatDialogRef<ControlSchemeCreateDialogComponent, { name: string }>,
        private readonly formBuilder: FormBuilder,
        private readonly translocoService: TranslocoService,
        private readonly store: Store
    ) {
        this.nameFormControl = this.formBuilder.control<string>(
            this.translocoService.translate('controlScheme.newSchemeDialogDefaultName'),
            {
                nonNullable: true,
                validators: [
                    Validators.required,
                ],
                asyncValidators: [
                    ControlSchemeValidators.nameUniqueness(this.store)
                ]
            }
        );
    }

    public canSubmit(): boolean {
        return this.nameFormControl.valid;
    }

    public onSubmit(
        event: Event
    ): void {
        event.preventDefault();
        if (this.canSubmit()) {
            this.dialogRef.close({
                name: this.nameFormControl.value,
            });
        }
    }

    public onCancel(): void {
        this.dialogRef.close();
    }
}
