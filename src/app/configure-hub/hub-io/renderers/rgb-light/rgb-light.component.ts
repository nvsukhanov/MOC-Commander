import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IoPortRendererBase } from '../../io-port-renderer';
import { JsonPipe } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-rgb-light',
    templateUrl: './rgb-light.component.html',
    styleUrls: [ './rgb-light.component.scss' ],
    imports: [
        JsonPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RgbLightComponent extends IoPortRendererBase {

}
