import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PushPipe } from '@ngrx/component';
import { MatButton } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { TranslocoPipe } from '@ngneat/transloco';

@Component({
    standalone: true,
    selector: 'lib-leaving-running-scheme-confirmation-dialog',
    templateUrl: './leaving-running-scheme-confirmation-dialog.component.html',
    styleUrls: [ './leaving-running-scheme-confirmation-dialog.component.scss' ],
    imports: [
        MatButton,
        MatDialogActions,
        MatDialogContent,
        MatDialogTitle,
        PushPipe,
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
