import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DecimalPipe, NgIf } from '@angular/common';
import { TranslocoPipe } from '@ngneat/transloco';
import { MatIconModule } from '@angular/material/icon';

import { WidgetComponent } from '../widget';

@Component({
    standalone: true,
    selector: 'lib-voltage-sensor-widget',
    templateUrl: './voltage-sensor-widget.component.html',
    styleUrls: [ './voltage-sensor-widget.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        NgIf,
        WidgetComponent,
        TranslocoPipe,
        MatIconModule,
        DecimalPipe
    ]
})
export class VoltageSensorWidgetComponent {
    @Input() public title = '';

    @Input() public subtitle = '';

    @Input() public voltage: number | undefined;

    @Input() public canBeDeleted = false;

    @Input() public canBeEdited = false;

    @Output() public readonly edit = new EventEmitter<void>();

    @Output() public readonly delete = new EventEmitter<void>();

    public onEdit(): void {
        this.edit.emit();
    }

    public onDelete(): void {
        this.delete.emit();
    }
}
