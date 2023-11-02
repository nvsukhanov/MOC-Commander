import { Injectable } from '@angular/core';

import { TiltGaugeSectorDefinition } from './tilt-gauge-sectors';
import { TiltGaugeSectorDefBuilderService } from './tilt-gauge-sector-def-builder.service';
import { TiltGaugeOptions } from './tilt-gauge-options';

@Injectable({ providedIn: 'root' })
export class TiltGaugeBracketsDefBuilderService {
    constructor(
        private readonly sectorDefService: TiltGaugeSectorDefBuilderService,
    ) {
    }

    public createBracketsSectorDefs(
        options: TiltGaugeOptions
    ): TiltGaugeSectorDefinition[] {
        const leftBracketStartAngle = -180 - options.bracketAngleSizeDegrees / 2;
        const leftBracketEndAngle = -180 + options.bracketAngleSizeDegrees / 2;

        const rightBracketStartAngle = -options.bracketAngleSizeDegrees / 2;
        const rightBracketEndAngle = options.bracketAngleSizeDegrees / 2;

        return [
            this.sectorDefService.createSectorDef(
                leftBracketStartAngle,
                leftBracketEndAngle,
                0,
                options.bracketWidth,
                options.chartRadius - options.bracketWidth / 2,
                options.chartRotation
            ),
            this.sectorDefService.createSectorDef(
                rightBracketStartAngle,
                rightBracketEndAngle,
                0,
                options.bracketWidth,
                options.chartRadius - options.bracketWidth / 2,
                options.chartRotation,
            )
        ];
    }
}
