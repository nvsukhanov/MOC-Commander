import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { TiltGaugeComponent } from '../tilt-gauge';

@Component({
    standalone: true,
    selector: 'app-pitch-indicator',
    templateUrl: './pitch-indicator.component.html',
    styleUrls: [ './pitch-indicator.component.scss' ],
    imports: [
        TiltGaugeComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PitchIndicatorComponent {
    @Input() public pitch?: number;
}
