import { Pipe, PipeTransform } from '@angular/core';
import { isAngleInSector } from '@app/shared-misc';

import { TiltGaugeSectorDefinition } from './tilt-gauge-sector-definition';

@Pipe({
  standalone: true,
  name: 'libTiltGaugeSectorHighlight',
  pure: true,
})
export class TiltGaugeSectorHighlightPipe implements PipeTransform {
  public transform(tiltDegrees: number | null, gaugeSector: TiltGaugeSectorDefinition): boolean {
    if (tiltDegrees === null) {
      return false;
    }

    return isAngleInSector(tiltDegrees, gaugeSector.from, gaugeSector.to) || isAngleInSector(tiltDegrees + 180, gaugeSector.from, gaugeSector.to);
  }
}
