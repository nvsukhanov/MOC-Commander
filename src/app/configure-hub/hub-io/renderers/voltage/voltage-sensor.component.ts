import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IoPortRendererBase } from '../../io-port-renderer';
import { JsonPipe } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-voltage-sensor',
    templateUrl: './voltage-sensor.component.html',
    styleUrls: [ './voltage-sensor.component.scss' ],
    imports: [
        JsonPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VoltageSensorComponent extends IoPortRendererBase {

}
