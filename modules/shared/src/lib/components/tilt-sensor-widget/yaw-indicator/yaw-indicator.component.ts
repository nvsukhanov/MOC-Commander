import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { TiltGaugeComponent, TiltGaugeOptions } from '../tilt-gauge';

@Component({
    standalone: true,
    selector: 'lib-yaw-indicator',
    templateUrl: './yaw-indicator.component.html',
    styleUrls: [ './yaw-indicator.component.scss' ],
    imports: [
        TiltGaugeComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class YawIndicatorComponent {
    @Input() public yaw?: number;

    public readonly options: Partial<TiltGaugeOptions> = {
        chartRotation: 90,
        gaugeSteps: 9,
        bracketAngleSizeDegrees: 181
    };
}
