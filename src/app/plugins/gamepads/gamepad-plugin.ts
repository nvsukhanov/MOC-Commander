import { Type } from '@angular/core';
import { GamepadControllerConfig } from '../../store';
import { GamepadView } from './gamepad-view';

export abstract class GamepadPlugin {
    abstract readonly configViewType: Type<GamepadView>;

    abstract controllerIdMatch(id: string): boolean;

    protected abstract mapSpecificFields(gamepad: Gamepad): Pick<GamepadControllerConfig, 'axes' | 'buttons' | 'nameL10nKey'>;

    public mapToDefaultConfig(gamepad: Gamepad): GamepadControllerConfig {
        return {
            id: gamepad.id,
            index: gamepad.index,
            ...this.mapSpecificFields(gamepad)
        };
    }
}
