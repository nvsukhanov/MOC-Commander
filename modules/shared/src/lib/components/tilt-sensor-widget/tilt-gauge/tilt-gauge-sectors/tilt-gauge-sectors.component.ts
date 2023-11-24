import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgForOf } from '@angular/common';

import { TiltGaugeSectorDefinition } from './tilt-gauge-sector-definition';
import { TiltGaugeSectorHighlightPipe } from './tilt-gauge-sector-highlight.pipe';

@Component({
    standalone: true,
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'g[libTiltGaugeSectors]',
    templateUrl: './tilt-gauge-sectors.component.html',
    styleUrls: [ './tilt-gauge-sectors.component.scss' ],
    imports: [
        NgForOf,
        TiltGaugeSectorHighlightPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TiltGaugeSectorsComponent {
    @Input() public viewBox = '0 0 0 0';

    @Input() public tiltDegrees?: number;

    @Input('libTiltGaugeSectors') public sectors: TiltGaugeSectorDefinition[] = [];

    public trackByFn(
        index: number,
        item: TiltGaugeSectorDefinition
    ): string {
        return item.id;
    }
}
