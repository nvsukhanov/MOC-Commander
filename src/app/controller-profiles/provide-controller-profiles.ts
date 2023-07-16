import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { ControllerDualshockProfileService } from './dualshock';
import { UnknownControllerProfileService } from './unknown-controller';
import { ControllerProfileFactoryService } from './controller-profile-factory.service';
import { ControllerProfile } from './controller-profile';
import { ControllerXbox360ProfileService } from './xbox-360';
import { KeyboardControllerProfileService } from './keyboard';
import { DisconnectedControllerProfileService } from './disconnected-controller';

export function provideControllerProfiles(): EnvironmentProviders {
    return makeEnvironmentProviders([
        { provide: ControllerProfile, useClass: ControllerDualshockProfileService, multi: true },
        { provide: ControllerProfile, useClass: ControllerXbox360ProfileService, multi: true },
        KeyboardControllerProfileService,
        UnknownControllerProfileService,
        ControllerProfileFactoryService,
        DisconnectedControllerProfileService
    ]);
}
