import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TiltData } from 'rxpoweredup';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoPipe } from '@ngneat/transloco';

import { WidgetComponent } from '../widget';
import { RollIndicatorComponent } from './roll-indicator';
import { YawIndicatorComponent } from './yaw-indicator';
import { PitchIndicatorComponent } from './pitch-indicator';
import { TiltGaugeIconDirective } from './tilt-gauge';

@Component({
    standalone: true,
    selector: 'app-tilt-sensor-widget',
    templateUrl: './tilt-sensor-widget.component.html',
    styleUrls: [ './tilt-sensor-widget.component.scss' ],
    imports: [
        WidgetComponent,
        RollIndicatorComponent,
        YawIndicatorComponent,
        PitchIndicatorComponent,
        TiltGaugeIconDirective,
        MatButtonModule,
        TranslocoPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TiltSensorWidgetComponent {
    @Input() public tilt: TiltData | undefined;

    @Input() public title = '';

    @Input() public canBeDeleted = false;

    @Input() public canBeEdited = false;

    @Output() public readonly edit = new EventEmitter<void>();

    @Output() public readonly delete = new EventEmitter<void>();

    @Output() public readonly compensateTilt = new EventEmitter<TiltData>();

    @Output() public readonly resetTiltCompensation = new EventEmitter<void>();

    public onCompensateTilt(
        compensationData?: TiltData
    ): void {
        this.compensateTilt.emit(compensationData);
    }

    public onResetTiltCompensation(): void {
        this.resetTiltCompensation.emit();
    }

    public onEdit(): void {
        this.edit.emit();
    }

    public onDelete(): void {
        this.delete.emit();
    }
}
