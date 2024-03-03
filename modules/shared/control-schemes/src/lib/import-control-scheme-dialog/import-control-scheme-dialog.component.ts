import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PushPipe } from '@ngrx/component';
import { TranslocoPipe } from '@ngneat/transloco';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

import { ControlSchemeDecompressorService } from './control-scheme-decompressor.service';
import { ControlSchemeImportValidationService } from './control-scheme-import-validation.service';

@Component({
    standalone: true,
    selector: 'lib-cs-import-control-scheme-dialog',
    templateUrl: './import-control-scheme-dialog.component.html',
    styleUrls: [ './import-control-scheme-dialog.component.scss' ],
    imports: [
        MatButtonModule,
        MatDialogModule,
        PushPipe,
        TranslocoPipe,
        MatInputModule,
        ReactiveFormsModule,
    ],
    providers: [
        ControlSchemeDecompressorService,
        ControlSchemeImportValidationService,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportControlSchemeDialogComponent {
    public readonly compressedSchemeInput: FormControl<string>;

    constructor(
        private readonly dialog: MatDialogRef<ImportControlSchemeDialogComponent>,
        private readonly formBuilder: FormBuilder,
        private readonly validationService: ControlSchemeImportValidationService,
        private readonly decompressor: ControlSchemeDecompressorService
    ) {
        this.compressedSchemeInput = this.formBuilder.control<string>(
            '',
            {
                nonNullable: true,
                validators: [
                    Validators.required,
                    this.validationService.buildStringInputValidator()
                ]
            }
        );
    }

    public onImport(): void {
        const decompressedData = this.decompressor.decompress(this.compressedSchemeInput.value);
        this.dialog.close(decompressedData);
    }

    public onCancel(): void {
        this.dialog.close();
    }
}
