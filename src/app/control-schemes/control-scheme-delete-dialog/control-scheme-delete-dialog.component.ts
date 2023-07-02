import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslocoModule } from '@ngneat/transloco';
import { MatButtonModule } from '@angular/material/button';

export type ControlSchemeDeleteDialogData = {
    name: string;
};

@Component({
    standalone: true,
    selector: 'app-control-scheme-delete-dialog',
    templateUrl: './control-scheme-delete-dialog.component.html',
    styleUrls: [ './control-scheme-delete-dialog.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatDialogModule,
        TranslocoModule,
        MatButtonModule
    ]
})
export class ControlSchemeDeleteDialogComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) public readonly data: ControlSchemeDeleteDialogData,
        public readonly dialogRef: MatDialogRef<ControlSchemeDeleteDialogComponent>,
    ) {
    }

    public onCancel(): void {
        this.dialogRef.close();
    }
}
