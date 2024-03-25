import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { TiltGaugeTickLineDefinition } from './tilt-gauge-tick-line-definition';

@Component({
    standalone: true,
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'g[appTiltGaugeTicks]',
    templateUrl: './tilt-gauge-ticks.component.html',
    styleUrls: [ './tilt-gauge-ticks.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TiltGaugeTicksComponent {
    @Input() public viewBox = '0 0 0 0';

    @Input('appTiltGaugeTicks') public ticks: TiltGaugeTickLineDefinition[] = [];
}
