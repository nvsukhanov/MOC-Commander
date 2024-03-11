import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoPipe } from '@ngneat/transloco';
import { MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { TiltGaugeComponent, TiltGaugeIconDirective, WidgetComponent } from '@app/shared-ui';

@Component({
    standalone: true,
    selector: 'lib-tilt-sensor-widget',
    templateUrl: './pitch-sensor-widget.component.html',
    styleUrls: [ './pitch-sensor-widget.component.scss' ],
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
export class PitchSensorWidgetComponent {
    @Input() public pitch: number | null = null;

    @Input() public title = '';

    @Input() public canBeDeleted = false;

    @Input() public canBeEdited = false;

    @Output() public readonly edit = new EventEmitter<void>();

    @Output() public readonly delete = new EventEmitter<void>();

    @Output() public readonly compensate = new EventEmitter<number>();

    @Output() public readonly resetCompensation = new EventEmitter<void>();

    public onCompensate(): void {
        if (this.pitch !== null) {
            this.compensate.emit(this.pitch);
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
