import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslocoPipe } from '@ngneat/transloco';
import { UploadFileFormControlComponent } from '@app/shared-ui';

@Component({
    standalone: true,
    selector: 'feat-settings-reset-state-dialog',
    templateUrl: './reset-state-dialog.component.html',
    styleUrls: [ './reset-state-dialog.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        TranslocoPipe,
        UploadFileFormControlComponent
    ]
})
export class ResetStateDialogComponent {
    constructor(
        private readonly dialog: MatDialogRef<ResetStateDialogComponent>,
    ) {
    }

    public onReset(): void {
        this.dialog.close(true);
    }

    public onCancel(): void {
        this.dialog.close(false);
    }
}
