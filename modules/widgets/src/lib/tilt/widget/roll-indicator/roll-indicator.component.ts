import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TiltGaugeComponent } from '@app/shared-ui';

@Component({
    standalone: true,
    selector: 'lib-roll-indicator',
    templateUrl: './roll-indicator.component.html',
    styleUrls: [ './roll-indicator.component.scss' ],
    imports: [
        TiltGaugeComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RollIndicatorComponent {
    @Input() public roll?: number;
}
