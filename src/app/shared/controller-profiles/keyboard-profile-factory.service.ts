import { Injectable } from '@angular/core';

import { ControllerProfileKeyboardService } from './keyboard';
import { UnknownControllerProfileFactoryService } from './unknown-controller';
import { IControllerProfile } from './i-controller-profile';
import { ControllerSettings, KeyboardSettings } from './controller-settings';

@Injectable()
export class KeyboardProfileFactoryService {
    constructor(
        private readonly keyboardProfile: ControllerProfileKeyboardService,
        private readonly unknownControllerProfileFactory: UnknownControllerProfileFactoryService,
    ) {
    }

    public getKeyboardProfile(): IControllerProfile<KeyboardSettings> {
        return this.keyboardProfile;
    }

    public getByProfileUid(
        profileUid: string
    ): IControllerProfile<ControllerSettings | null> {
        if (profileUid === this.keyboardProfile.uid) {
            return this.keyboardProfile;
        }
        return this.unknownControllerProfileFactory.fromUid(profileUid);
    }
}
