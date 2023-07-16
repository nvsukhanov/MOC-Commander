import { Inject, Injectable } from '@angular/core';
import { ControllerType } from '@app/shared';

import { UnknownControllerProfileService } from './unknown-controller';
import { ControllerProfile } from './controller-profile';
import { IControllerProfile } from './i-controller-profile';
import { KeyboardControllerProfileService } from './keyboard';
import { DisconnectedControllerProfileService } from './disconnected-controller';

@Injectable()
export class ControllerProfileFactoryService {
    constructor(
        @Inject(ControllerProfile) private readonly controllerProfiles: readonly ControllerProfile[],
        private readonly unknownGamepadProfile: UnknownControllerProfileService,
        private readonly keyboardProfile: KeyboardControllerProfileService,
        private readonly disconnectedControllerProfile: DisconnectedControllerProfileService
    ) {
    }

    public getProfile(
        controllerType?: ControllerType,
        id?: string
    ): IControllerProfile {
        if (controllerType === ControllerType.Keyboard) {
            return this.keyboardProfile;
        }
        if (id == undefined || controllerType === undefined) {
            return this.disconnectedControllerProfile;
        }
        const profile = this.controllerProfiles.find((p) => p.controllerIdMatch(id));
        return profile ?? this.unknownGamepadProfile;
    }
}
