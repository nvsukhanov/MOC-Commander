import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslocoPipe } from '@ngneat/transloco';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { ServoCalibrationService } from './servo-calibration.service';

export type ServoCalibrationDialogData = {
    hubId: string;
    portId: number;
    power: number;
};

@Component({
    standalone: true,
    selector: 'app-servo-calibration-dialog',
    templateUrl: './servo-calibration-dialog.component.html',
    styleUrls: [ './servo-calibration-dialog.component.scss' ],
    imports: [
        MatButtonModule,
        MatProgressBarModule,
        TranslocoPipe,
        MatDialogModule
    ],
    providers: [
        ServoCalibrationService
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServoCalibrationDialogComponent implements OnInit, OnDestroy {
    private readonly sub = new Subscription();

    constructor(
        private readonly dialog: MatDialogRef<ServoCalibrationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private readonly data: ServoCalibrationDialogData,
        private readonly calibrationService: ServoCalibrationService
    ) {
    }

    public ngOnInit(): void {
        this.sub.add(
            this.calibrationService.calibrateServo(this.data.hubId, this.data.portId, this.data.power).subscribe((result) => {
                this.dialog.close(result);
            })
        );
    }

    public ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    public onCancel(): void {
        this.dialog.close(null);
    }
}
