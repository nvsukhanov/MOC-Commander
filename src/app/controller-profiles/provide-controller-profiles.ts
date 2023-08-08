import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { ControllerProfileFactoryService } from './controller-profile-factory.service';
import { GamepadProfile } from './gamepad-profile';
import { ControllerProfileKeyboardService } from './controller-profile-keyboard.service';
import { ControllerProfileDualshockService } from './controller-profile-dualshock.service';
import { ControllerProfileXbox360Service } from './controller-profile-xbox360.service';
import { ControllerProfileGenericGamepadFactoryService } from './controller-profile-generic-gamepad-factory.service';

export function provideControllerProfiles(): EnvironmentProviders {
    return makeEnvironmentProviders([
        { provide: GamepadProfile, useClass: ControllerProfileDualshockService, multi: true },
        { provide: GamepadProfile, useClass: ControllerProfileXbox360Service, multi: true },
        ControllerProfileKeyboardService,
        ControllerProfileGenericGamepadFactoryService,
        ControllerProfileFactoryService,
    ]);
}
