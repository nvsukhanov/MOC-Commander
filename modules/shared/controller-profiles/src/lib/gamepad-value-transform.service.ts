import { Inject, Injectable } from '@angular/core';

import { GamepadAxisSettings, GamepadButtonSettings } from './controller-settings';
import { CONTROLLERS_CONFIG, IControllersConfig } from './i-controllers-config';

@Injectable({ providedIn: 'root' })
export class GamepadValueTransformService {
    constructor(
        @Inject(CONTROLLERS_CONFIG) private readonly config: IControllersConfig
    ) {
    }

    public isAxisActivationThresholdReached(
        value: number,
        settings?: GamepadAxisSettings
    ): boolean {
        if (!settings) {
            return value > 0.5 || value < -0.5; // fallback, should never happen, (only if there is something wrong with the store)
        }
        if (settings.ignoreInput) {
            return false;
        }
        return Math.abs(value) >= settings.activationThreshold;
    }

    public isButtonActivationThresholdReached(
        value: number,
        settings?: GamepadButtonSettings
    ): boolean {
        if (!settings) {
            return value > 0.5 || value < -0.5; // fallback, should never happen, (only if there is something wrong with the store)
        }
        if (settings.ignoreInput) {
            return false;
        }
        return Math.abs(value) >= settings.activationThreshold;
    }

    public transformAxisValue(
        rawValue: number,
        settings?: GamepadAxisSettings
    ): number {
        if (!settings) {
            return this.truncateAndClamp(rawValue);
        }
        const preparedRawValue = rawValue * (settings.invert ? -1 : 1);
        return this.truncateAndClamp(
            this.applyActiveZone(preparedRawValue, settings.activeZoneStart, settings.activeZoneEnd)
        );
    }

    public transformButtonValue(
        rawValue: number,
        settings?: GamepadButtonSettings
    ): number {
        if (!settings) {
            return this.truncateAndClamp(rawValue);
        }
        const preparedRawValue = rawValue * (settings.invert ? -1 : 1);
        return this.truncateAndClamp(
            this.applyActiveZone(preparedRawValue, settings.activeZoneStart, settings.activeZoneEnd)
        );
    }

    private truncateAndClamp(
        value: number,
    ): number {
        return Math.min(
            this.config.maxInputValue,
            Math.max(
                this.config.minInputValue,
                Math.round((value + Number.EPSILON) * 100) / 100
            )
        );
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
