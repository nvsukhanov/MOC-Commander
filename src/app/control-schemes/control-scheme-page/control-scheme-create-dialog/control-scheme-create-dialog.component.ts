import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { WINDOW } from '@app/shared';

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
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeCreateDialogComponent {
    protected readonly nameFormControl: FormControl<string>;

    constructor(
        private readonly dialogRef: MatDialogRef<ControlSchemeCreateDialogComponent, { name: string; id: string }>,
        private readonly formBuilder: FormBuilder,
        @Inject(WINDOW) private readonly window: Window,
        private readonly translocoService: TranslocoService
    ) {
        this.nameFormControl = this.formBuilder.control<string>(
            this.translocoService.translate('controlScheme.newSchemeDialogDefaultName'),
            { nonNullable: true, validators: [ Validators.required ] }
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
                id: this.window.crypto.randomUUID()
            });
        }
    }

    public onCancel(): void {
        this.dialogRef.close();
    }
}
