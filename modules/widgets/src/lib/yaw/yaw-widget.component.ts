import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoPipe } from '@ngneat/transloco';
import { MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { TiltGaugeComponent, TiltGaugeIconDirective, TiltGaugeOptions, WidgetComponent } from '@app/shared-ui';

@Component({
    standalone: true,
    selector: 'lib-yaw-sensor-widget',
    templateUrl: './yaw-widget.component.html',
    styleUrls: [ './yaw-widget.component.scss' ],
    imports: [
        WidgetComponent,
        TiltGaugeIconDirective,
        MatButtonModule,
        TranslocoPipe,
        TiltGaugeComponent,
        MatMenuItem,
        MatIcon
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class YawWidgetComponent {
    @Input() public yaw: number | null = null;

    @Input() public title = '';

    @Input() public canBeDeleted = false;

    @Input() public canBeEdited = false;

    @Output() public readonly edit = new EventEmitter<void>();

    @Output() public readonly delete = new EventEmitter<void>();

    @Output() public readonly compensate = new EventEmitter<number>();

    @Output() public readonly resetCompensation = new EventEmitter<void>();

    public readonly options: Partial<TiltGaugeOptions> = {
        chartRotation: 90,
        gaugeSteps: 9,
        bracketAngleSizeDegrees: 181
    };

    public onCompensate(): void {
        if (this.yaw !== null) {
            this.compensate.emit(this.yaw);
        }
    }

    public onResetCompensation(): void {
        this.resetCompensation.emit();
    }

    public onEdit(): void {
        this.edit.emit();
    }

    public onDelete(): void {
        this.delete.emit();
    }
}
