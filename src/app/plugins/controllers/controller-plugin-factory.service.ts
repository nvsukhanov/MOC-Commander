import { Inject, Injectable } from '@angular/core';
import { UnknownControllerPluginService } from './unknown-controller';
import { ControllerPlugin } from './controller-plugin';
import { IControllerPlugin } from './i-controller-plugin';
import { ControllerType } from './controller-type';
import { KeyboardControllerPluginService } from './keyboard';
import { DisconnectedControllerPluginService } from './disconnected-controller';

@Injectable()
export class ControllerPluginFactoryService {
    constructor(
        @Inject(ControllerPlugin) private readonly controllerPlugins: readonly ControllerPlugin[],
        private readonly unknownGamepadPlugin: UnknownControllerPluginService,
        private readonly keyboardPlugin: KeyboardControllerPluginService,
        private readonly disconnectedController: DisconnectedControllerPluginService
    ) {
    }

    public getPlugin(
        controllerType?: ControllerType,
        id?: string
    ): IControllerPlugin {
        if (controllerType === ControllerType.Keyboard) {
            return this.keyboardPlugin;
        }
        if (id == undefined || controllerType === undefined) {
            return this.disconnectedController;
        }
        const plugin = this.controllerPlugins.find((p) => p.controllerIdMatch(id));
        return plugin ?? this.unknownGamepadPlugin;
    }
}
