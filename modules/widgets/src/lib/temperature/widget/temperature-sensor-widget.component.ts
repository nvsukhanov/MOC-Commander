import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoPipe } from '@ngneat/transloco';
import { WidgetComponent } from '@app/shared-components';

@Component({
    standalone: true,
    selector: 'lib-temperature-sensor-widget',
    templateUrl: './temperature-sensor-widget.component.html',
    styleUrls: [ './temperature-sensor-widget.component.scss' ],
    imports: [
        DecimalPipe,
        MatIconModule,
        TranslocoPipe,
        WidgetComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemperatureSensorWidgetComponent {
    @Input() public title = '';

    @Input() public subtitle = '';

    @Input() public canBeDeleted = false;

    @Input() public canBeEdited = false;

    @Input() public data: number | undefined;

    @Output() public readonly delete = new EventEmitter<void>();

    @Output() public readonly edit = new EventEmitter<void>();

    public onEdit(): void {
        this.edit.emit();
    }

    public onDelete(): void {
        this.delete.emit();
    }
}
