import { Inject, Injectable } from '@angular/core';
import { ControllerDefaultPluginService } from './default';
import { GamepadPlugin } from './gamepad-plugin';

@Injectable()
export class GamepadPluginsService {
    constructor(
        @Inject(GamepadPlugin) private readonly gamepadPlugins: readonly GamepadPlugin[],
        private readonly defaultPlugin: ControllerDefaultPluginService
    ) {
    }

    public getPlugin(id: string): GamepadPlugin {
        const plugin = this.gamepadPlugins.find((p) => p.controllerIdMatch(id));
        return plugin ?? this.defaultPlugin;
    }
}
