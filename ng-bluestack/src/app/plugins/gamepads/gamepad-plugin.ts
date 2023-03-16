import { Type } from '@angular/core';
import { ControllerState, GamepadControllerConfig } from '../../store';
import { GamepadView } from './gamepad-view';

export interface IGamepadViewComponent {
    writeConfiguration(config: GamepadControllerConfig): void;

    writeGamepadState(state: ControllerState): void;
}

export abstract class GamepadPlugin {
    abstract readonly configViewType: Type<GamepadView>;

    abstract controllerIdMatch(id: string): boolean;

    public mapToDefaultConfig(gamepad: Gamepad): GamepadControllerConfig {
        return {
            id: gamepad.id,
            index: gamepad.index,
            ...this.mapSpecificFields(gamepad)
        };
    }

    protected abstract mapSpecificFields(gamepad: Gamepad): Pick<GamepadControllerConfig, 'axes' | 'buttons' | 'nameL10nKey'>;
}
