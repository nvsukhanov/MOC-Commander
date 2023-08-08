import { Inject, Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

import { IControllerProfile } from './i-controller-profile';
import { ControllerProfileKeyboardService } from './controller-profile-keyboard.service';
import { ControllerProfileGenericGamepadFactoryService } from './controller-profile-generic-gamepad-factory.service';
import { GamepadProfile } from './gamepad-profile';

@Injectable()
export class ControllerProfileFactoryService {
    constructor(
        @Inject(GamepadProfile) private readonly controllerProfiles: readonly GamepadProfile[],
        private readonly keyboardProfile: ControllerProfileKeyboardService,
        private readonly translocoService: TranslocoService,
        private readonly genericGamepadFactory: ControllerProfileGenericGamepadFactoryService
    ) {
    }

    public getGamepadProfile(
        gamepad: Gamepad
    ): IControllerProfile {
        const profile = this.controllerProfiles.find((p) => p.controllerIdMatch(gamepad.id));
        if (profile) {
            return profile;
        }
        return this.genericGamepadFactory.fromGamepadAPI(gamepad);
    }

    public getKeyboardProfile(): IControllerProfile {
        return this.keyboardProfile;
    }

    public getByProfileUid(
        profileUid: string
    ): IControllerProfile {
        if (profileUid === this.keyboardProfile.uid) {
            return this.keyboardProfile;
        }
        const profile = this.controllerProfiles.find((p) => p.uid === profileUid);
        if (profile) {
            return profile;
        }
        const genericGamepadProfile = this.genericGamepadFactory.fromUid(profileUid, this.translocoService);
        if (genericGamepadProfile) {
            return genericGamepadProfile;
        }
        throw new Error(`No profile found for uid ${profileUid}`);
    }
}
