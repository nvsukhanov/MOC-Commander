import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { TranslocoPipe } from '@ngneat/transloco';

@Component({
    standalone: true,
    selector: 'lib-unsaved-changed-confirmation-dialog',
    templateUrl: './unsaved-changed-confirmation-dialog.component.html',
    styleUrls: [ './unsaved-changed-confirmation-dialog.component.scss' ],
    imports: [
        MatButton,
        MatDialogActions,
        MatDialogContent,
        MatDialogTitle,
        TranslocoPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnsavedChangedConfirmationDialogComponent {
    constructor(
        private readonly dialog: MatDialogRef<UnsavedChangedConfirmationDialogComponent>,
    ) {
    }

    public onConfirm(): void {
        this.dialog.close(true);
    }

    public onCancel(): void {
        this.dialog.close(false);
    }
}
