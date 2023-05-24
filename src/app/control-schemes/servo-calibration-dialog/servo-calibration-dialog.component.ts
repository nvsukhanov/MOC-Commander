import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
    standalone: true,
    selector: 'app-servo-calibration-dialog',
    templateUrl: './servo-calibration-dialog.component.html',
    styleUrls: [ './servo-calibration-dialog.component.scss' ],
    imports: [
        MatCardModule,
        MatButtonModule,
        MatProgressBarModule,
        TranslocoModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServoCalibrationDialogComponent {
    @Output() public readonly cancel = new EventEmitter<void>();

    public onCancel(): void {
        this.cancel.emit();
    }
}
