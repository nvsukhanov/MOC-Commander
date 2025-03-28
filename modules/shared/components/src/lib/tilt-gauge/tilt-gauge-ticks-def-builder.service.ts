import { Injectable } from '@angular/core';
import { scalarMultiply, unitVectorFromAngle } from '@app/shared-misc';

import { TiltGaugeTickLineDefinition } from './tilt-gauge-ticks';
import { TiltGaugeOptions } from './tilt-gauge-options';

@Injectable({ providedIn: 'root' })
export class TiltGaugeTicksDefBuilderService {
  public buildCenterLines(options: TiltGaugeOptions): TiltGaugeTickLineDefinition[] {
    const leftBracketCenterAngle = -180 + options.chartRotation;
    const rightBracketCenterAngle = options.chartRotation;
    const lineStartRadius = options.chartRadius - options.bracketWidth - options.bracketGaugePadding * 2 - options.gaugeStrokeWidth;
    const lineEndRadius = lineStartRadius - options.gaugeStrokeWidth;

    const leftBracketCenterLineStart = scalarMultiply(lineStartRadius, unitVectorFromAngle(leftBracketCenterAngle));
    const leftBracketCenterLineEnd = scalarMultiply(lineEndRadius, unitVectorFromAngle(leftBracketCenterAngle));
    const rightBracketCenterLineStart = scalarMultiply(lineStartRadius, unitVectorFromAngle(rightBracketCenterAngle));
    const rightBracketCenterLineEnd = scalarMultiply(lineEndRadius, unitVectorFromAngle(rightBracketCenterAngle));

    return [
      {
        x1: leftBracketCenterLineStart.x,
        x2: leftBracketCenterLineEnd.x,
        y1: leftBracketCenterLineStart.y,
        y2: leftBracketCenterLineEnd.y,
        width: options.bracketCenterLineStrokeWidth,
      },
      {
        x1: rightBracketCenterLineStart.x,
        x2: rightBracketCenterLineEnd.x,
        y1: rightBracketCenterLineStart.y,
        y2: rightBracketCenterLineEnd.y,
        width: options.bracketCenterLineStrokeWidth,
      },
    ];
  }
}
