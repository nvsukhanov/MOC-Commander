import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { ControllerProfileKeyboardService } from './keyboard';
import {
    ControllerProfileDualshockService,
    ControllerProfileGenericGamepadFactoryService,
    ControllerProfileJoyconLService,
    ControllerProfileJoyconLrService,
    ControllerProfileJoyconRService,
    ControllerProfileXbox360Service
} from './gamepad';
import { ControllerProfileHubFactoryService } from './hub';
import { UnknownControllerProfileFactoryService } from './unknown-controller';
import { GamepadProfile } from './gamepad-profile';
import { GamepadProfileFactoryService } from './gamepad-profile-factory.service';
import { KeyboardProfileFactoryService } from './keyboard-profile-factory.service';
import { HubProfileFactoryService } from './hub-profile-factory.service';

export function provideControllerProfiles(): EnvironmentProviders {
    return makeEnvironmentProviders([
        { provide: GamepadProfile, useClass: ControllerProfileDualshockService, multi: true },
        { provide: GamepadProfile, useClass: ControllerProfileXbox360Service, multi: true },
        { provide: GamepadProfile, useClass: ControllerProfileJoyconRService, multi: true },
        { provide: GamepadProfile, useClass: ControllerProfileJoyconLService, multi: true },
        { provide: GamepadProfile, useClass: ControllerProfileJoyconLrService, multi: true },
        ControllerProfileKeyboardService,
        ControllerProfileGenericGamepadFactoryService,
        ControllerProfileHubFactoryService,
        UnknownControllerProfileFactoryService,
        GamepadProfileFactoryService,
        KeyboardProfileFactoryService,
        HubProfileFactoryService
    ]);
}
