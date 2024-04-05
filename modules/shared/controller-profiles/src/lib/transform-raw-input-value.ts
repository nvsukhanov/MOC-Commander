import { GamepadAxisSettings, GamepadButtonSettings } from './controller-settings';
import { truncateAndClampInputValue } from './truncate-and-clamp-input-value';
import { applyActiveZoneToInputValue } from './apply-active-zone-to-input-value';

export function transformRawInputValue(
    rawValue: number,
    settings?: GamepadAxisSettings | GamepadButtonSettings
): number {
    if (!settings) {
        return truncateAndClampInputValue(rawValue);
    }
    const preparedRawValue = rawValue * (settings.invert ? -1 : 1);
    return truncateAndClampInputValue(
        applyActiveZoneToInputValue(preparedRawValue, settings.activeZoneStart, settings.activeZoneEnd)
    );
}
