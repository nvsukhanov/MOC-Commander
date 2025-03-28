import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { TiltGaugeSectorDefinition } from './tilt-gauge-sector-definition';
import { TiltGaugeSectorHighlightPipe } from './tilt-gauge-sector-highlight.pipe';

@Component({
  standalone: true,
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'g[libTiltGaugeSectors]',
  templateUrl: './tilt-gauge-sectors.component.html',
  styleUrl: './tilt-gauge-sectors.component.scss',
  imports: [TiltGaugeSectorHighlightPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TiltGaugeSectorsComponent {
  @Input() public viewBox = '0 0 0 0';

  @Input() public tiltDegrees: number | null = null;

  @Input('libTiltGaugeSectors') public sectors: TiltGaugeSectorDefinition[] = [];
}
