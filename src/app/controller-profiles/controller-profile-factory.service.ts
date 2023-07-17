import { Inject, Injectable } from '@angular/core';
import { ControllerType } from '@app/shared';

import { GenericGamepadProfileService } from './unknown-controller';
import { ControllerProfile } from './controller-profile';
import { IControllerProfile } from './i-controller-profile';
import { KeyboardControllerProfileService } from './keyboard';

@Injectable()
export class ControllerProfileFactoryService {
    constructor(
        @Inject(ControllerProfile) private readonly controllerProfiles: readonly ControllerProfile[],
        private readonly unknownGamepadProfile: GenericGamepadProfileService,
        private readonly keyboardProfile: KeyboardControllerProfileService,
    ) {
    }

    public getProfile(
        controllerType?: ControllerType,
        id?: string
    ): IControllerProfile {
        if (controllerType === ControllerType.Keyboard) {
            return this.keyboardProfile;
        }
        if (id !== undefined) {
            const profile = this.controllerProfiles.find((p) => p.controllerIdMatch(id));
            return profile ?? this.unknownGamepadProfile;
        }
        return this.unknownGamepadProfile;
    }

    public getByProfileUid(
        profileUid?: string
    ): IControllerProfile {
        if (profileUid === this.keyboardProfile.uid) {
            return this.keyboardProfile;
        }
        const profile = this.controllerProfiles.find((p) => p.uid === profileUid);
        return profile ?? this.unknownGamepadProfile;
    }
}
