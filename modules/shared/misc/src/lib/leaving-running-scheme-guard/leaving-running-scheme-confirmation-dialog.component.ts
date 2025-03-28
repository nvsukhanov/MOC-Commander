import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
    standalone: true,
    selector: 'lib-leaving-running-scheme-confirmation-dialog',
    templateUrl: './leaving-running-scheme-confirmation-dialog.component.html',
    styleUrl: './leaving-running-scheme-confirmation-dialog.component.scss',
    imports: [
        MatButton,
        MatDialogActions,
        MatDialogContent,
        MatDialogTitle,
        TranslocoPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeavingRunningSchemeConfirmationDialogComponent {
    constructor(
        private readonly dialog: MatDialogRef<LeavingRunningSchemeConfirmationDialogComponent>,
    ) {
    }

    public onConfirm(): void {
        this.dialog.close(true);
    }

    public onCancel(): void {
        this.dialog.close(false);
    }
}
