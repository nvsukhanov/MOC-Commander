import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { ControllerDualshockPluginService } from './dualshock';
import { ControllerDefaultPluginService } from './default';
import { GamepadPluginsService } from './gamepad-plugins.service';
import { GamepadPlugin } from './gamepad-plugin';

export function provideGamepadsPlugins(): EnvironmentProviders {
    return makeEnvironmentProviders([
        { provide: GamepadPlugin, useClass: ControllerDualshockPluginService, multi: true },
        ControllerDefaultPluginService,
        GamepadPluginsService,
    ]);
}
