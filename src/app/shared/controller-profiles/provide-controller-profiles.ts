import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { ControllerProfileKeyboardService } from './keyboard';
import { ControllerProfileDualshockService, ControllerProfileGenericGamepadFactoryService, ControllerProfileXbox360Service } from './gamepad';
import { ControllerProfileHubFactoryService } from './hub';
import { UnknownControllerProfileFactoryService } from './unknown-controller';
import { GamepadProfile } from './gamepad-profile';

export function provideControllerProfiles(): EnvironmentProviders {
    return makeEnvironmentProviders([
        { provide: GamepadProfile, useClass: ControllerProfileDualshockService, multi: true },
        { provide: GamepadProfile, useClass: ControllerProfileXbox360Service, multi: true },
        ControllerProfileKeyboardService,
        ControllerProfileGenericGamepadFactoryService,
        ControllerProfileHubFactoryService,
        UnknownControllerProfileFactoryService
    ]);
}
