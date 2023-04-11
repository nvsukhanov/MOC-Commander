import { Type } from '@angular/core';
import { GamepadConfig } from '../../store';
import { GamepadView } from './gamepad-view';

export abstract class GamepadPlugin {
    abstract readonly configViewType: Type<GamepadView>;

    abstract controllerIdMatch(id: string): boolean;

    protected abstract mapSpecificFields(gamepad: Gamepad): Pick<GamepadConfig, 'axes' | 'buttons' | 'nameL10nKey'>;

    public mapToDefaultConfig(gamepad: Gamepad): GamepadConfig {
        return {
            name: gamepad.id,
            gamepadIndex: gamepad.index,
            ...this.mapSpecificFields(gamepad)
        };
    }
}
