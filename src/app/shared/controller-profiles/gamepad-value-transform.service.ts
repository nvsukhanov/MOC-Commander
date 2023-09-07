import { Injectable } from '@angular/core';

import { GamepadAxisSettings } from './controller-settings';

@Injectable({ providedIn: 'root' })
export class GamepadValueTransformService {
    public transformAxisValue(
        rawValue: number,
        settings: GamepadAxisSettings
    ): number {
        const value = this.trimValue(this.applyActiveZone(rawValue, settings.activeZoneStart, settings.activeZoneEnd));
        return settings.invert ? -value : value;
    }

    public trimValue(
        value: number,
    ): number {
        return Math.round(value * 100) / 100;
    }

    private applyActiveZone(
        value: number,
        activeZoneStart: number,
        activeZoneEnd: number
    ): number {
        const absValue = Math.abs(value);
        const sign = Math.sign(value);

        if (absValue < activeZoneStart) {
            return 0;
        }

        if (absValue > activeZoneEnd) {
            return sign;
        }

        return sign * ((absValue - activeZoneStart) / (activeZoneEnd - activeZoneStart));
    }
}
