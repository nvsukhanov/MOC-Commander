import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IoPortRendererBase } from '../../io-port-renderer';
import { JsonPipe } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-io-current-sensor',
    templateUrl: './io-current-sensor.component.html',
    styleUrls: [ './io-current-sensor.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        JsonPipe
    ]
})
export class IoCurrentSensorComponent extends IoPortRendererBase {
}
