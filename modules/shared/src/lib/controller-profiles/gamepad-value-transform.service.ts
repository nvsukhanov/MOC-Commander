import { Injectable } from '@angular/core';

import { GamepadAxisSettings, GamepadButtonSettings } from './controller-settings';
import { MAX_INPUT_VALUE, MIN_INPUT_VALUE } from '../consts';

@Injectable({ providedIn: 'root' })
export class GamepadValueTransformService {
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
        const normalizedValue = settings.negativeValueCanActivate ? Math.abs(value) : value;
        return normalizedValue >= settings.activationThreshold;
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
        const normalizedValue = settings.negativeValueCanActivate ? Math.abs(value) : value;
        return normalizedValue >= settings.activationThreshold;
    }

    public transformAxisRawValue(
        rawValue: number,
        settings?: GamepadAxisSettings
    ): number {
        if (!settings) {
            return this.truncateAndClamp(rawValue);
        }
        if (settings.ignoreInput) {
            return 0;
        }
        return this.truncateAndClamp(rawValue * (settings.invert ? -1 : 1) + settings.trim);
    }

    public transformButtonRawValue(
        rawValue: number,
        settings?: GamepadButtonSettings
    ): number {
        if (!settings) {
            return this.truncateAndClamp(rawValue);
        }
        if (settings.ignoreInput) {
            return 0;
        }
        return this.truncateAndClamp(rawValue * (settings.invert ? -1 : 1) + settings.trim);
    }

    public transformAxisValue(
        rawValue: number,
        settings?: GamepadAxisSettings
    ): number {
        if (!settings) {
            return this.truncateAndClamp(rawValue);
        }
        return this.truncateAndClamp(this.applyActiveZone(rawValue, settings.activeZoneStart, settings.activeZoneEnd));
    }

    public transformButtonValue(
        rawValue: number,
        settings?: GamepadButtonSettings
    ): number {
        if (!settings) {
            return this.truncateAndClamp(rawValue);
        }
        return this.truncateAndClamp(this.applyActiveZone(rawValue, settings.activeZoneStart, settings.activeZoneEnd));
    }

    public truncateAndClamp(
        value: number,
    ): number {
        return Math.min(
            MAX_INPUT_VALUE,
            Math.max(
                MIN_INPUT_VALUE,
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
