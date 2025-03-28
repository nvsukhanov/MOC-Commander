import { Injectable } from '@angular/core';
import { IdGeneratorService, scalarMultiply, unitVectorFromAngle } from '@app/shared-misc';

import { TiltGaugeSectorDefinition } from './tilt-gauge-sectors';
import { TiltGaugeOptions } from './tilt-gauge-options';

@Injectable({ providedIn: 'root' })
export class TiltGaugeSectorDefBuilderService {
  constructor(private readonly idGeneratorService: IdGeneratorService) {}

  public createSequentialSectorDefinitions(options: TiltGaugeOptions): TiltGaugeSectorDefinition[] {
    const result: TiltGaugeSectorDefinition[] = [];
    for (const startingAngle of [-180, 0]) {
      let previousEndingAngle = startingAngle - options.gaugeStepSizeDegrees * options.gaugeSteps;
      for (let i = 0; i < options.gaugeSteps * 2; i++) {
        const endingAngle = previousEndingAngle + options.gaugeStepSizeDegrees;
        const sectorDef = this.createSectorDef(
          previousEndingAngle,
          endingAngle,
          options.gaugeSectorPaddingDegrees,
          options.gaugeStrokeWidth,
          options.chartRadius - options.bracketWidth * 2 - options.bracketGaugePadding * 2,
          options.chartRotation,
        );
        result.push(sectorDef);
        previousEndingAngle = endingAngle;
      }
    }
    return result;
  }

  public createSectorDef(from: number, to: number, paddingAngle: number, width: number, radius: number, chartRotation: number): TiltGaugeSectorDefinition {
    const cutoffStart = scalarMultiply(radius * 2, unitVectorFromAngle(from + paddingAngle + chartRotation));
    const cutoffMid = scalarMultiply(radius * 2, unitVectorFromAngle((from + to) / 2 + chartRotation));
    const cutoffEnd = scalarMultiply(radius * 2, unitVectorFromAngle(to - paddingAngle + chartRotation));

    const cutoffPath = `M 0 0
             L ${cutoffStart.x} ${cutoffStart.y}
             L ${cutoffMid.x} ${cutoffMid.y}
             L ${cutoffEnd.x} ${cutoffEnd.y}
             Z
        `;
    const id = this.idGeneratorService.generateId();
    const clipPathId = `url(#${id})`;

    return {
      id,
      cutoffPath,
      clipPathId,
      width,
      radius,
      from,
      to,
      chartRotation,
    };
  }
}
