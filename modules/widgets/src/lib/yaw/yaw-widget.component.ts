import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { TiltGaugeComponent, TiltGaugeIconDirective, TiltGaugeOptions, WidgetComponent } from '@app/shared-components';

@Component({
    standalone: true,
    selector: 'lib-yaw-sensor-widget',
    templateUrl: './yaw-widget.component.html',
    styleUrls: [ '../common/common-tilt-widgets-styles.scss' ],
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

    private isCompensating = false;

    public toggleCompensation(): void {
        if (this.isCompensating) {
            this.resetCompensation.emit();
            this.isCompensating = false;
        } else if (this.yaw !== null) {
            this.compensate.emit(this.yaw);
            this.isCompensating = true;
        }
    }

    public onEdit(): void {
        this.edit.emit();
    }

    public onDelete(): void {
        this.delete.emit();
    }
}
