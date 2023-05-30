import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
    standalone: true,
    selector: 'app-waiting-for-input-dialog',
    templateUrl: './waiting-for-input-dialog.component.html',
    styleUrls: [ './waiting-for-input-dialog.component.scss' ],
    imports: [
        MatCardModule,
        MatButtonModule,
        MatProgressBarModule,
        TranslocoModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WaitingForInputDialogComponent {
    @Output() public readonly cancel = new EventEmitter<void>();

    public onCancel(): void {
        this.cancel.emit();
    }
}
