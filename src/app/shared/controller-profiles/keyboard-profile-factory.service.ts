import { Injectable } from '@angular/core';
import {
    ControllerProfileKeyboardService,
    ControllerSettings,
    IControllerProfile,
    KeyboardSettings,
    UnknownControllerProfileFactoryService
} from '@app/shared';

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
