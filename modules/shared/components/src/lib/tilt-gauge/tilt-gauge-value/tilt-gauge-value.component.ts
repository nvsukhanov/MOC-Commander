import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
    standalone: true,
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'g[appTiltGaugeValue]',
    templateUrl: './tilt-gauge-value.component.html',
    styleUrls: [ './tilt-gauge-value.component.scss' ],
    imports: [
        TranslocoPipe,
        MatTooltip
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TiltGaugeValueComponent {
    @Input() public viewBox = '0 0 0 0';

    @Input() public clickable = false;

    @Input('appTiltGaugeValue') public value: number | null = null;

    @Output() public readonly clicked = new EventEmitter<Event>();

    public onClick(
        event: Event
    ): void {
        if (this.clickable) {
            this.clicked.emit(event);
        }
    }
}
