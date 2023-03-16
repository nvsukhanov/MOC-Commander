import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { ControllerDualshockPluginService } from './dualshock';
import { GAMEPAD_PLUGIN } from './i-gamepad-plugin';

export function provideGamepadsPlugins(): EnvironmentProviders {
    return makeEnvironmentProviders([
        { provide: GAMEPAD_PLUGIN, useClass: ControllerDualshockPluginService, multi: true }
    ])
}
