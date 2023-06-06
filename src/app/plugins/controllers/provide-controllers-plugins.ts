import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { ControllerDualshockPluginService } from './dualshock';
import { UnknownControllerPluginService } from './unknown-controller';
import { ControllerPluginFactoryService } from './controller-plugin-factory.service';
import { ControllerPlugin } from './controller-plugin';
import { ControllerXbox360PluginService } from './xbox-360';
import { KeyboardControllerPluginService } from './keyboard';
import { DisconnectedControllerPluginService } from './disconnected-controller';

export function provideControllersPlugins(): EnvironmentProviders {
    return makeEnvironmentProviders([
        { provide: ControllerPlugin, useClass: ControllerDualshockPluginService, multi: true },
        { provide: ControllerPlugin, useClass: ControllerXbox360PluginService, multi: true },
        KeyboardControllerPluginService,
        UnknownControllerPluginService,
        ControllerPluginFactoryService,
        DisconnectedControllerPluginService
    ]);
}
