import { Inject, Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import {
    ControllerProfileGenericGamepadFactoryService,
    ControllerProfileHubFactoryService,
    ControllerProfileKeyboardService,
    ControllerSettings,
    GamepadProfile,
    GamepadSettings,
    HubControllerSettings,
    IControllerProfile,
    KeyboardSettings
} from '@app/shared';

import { HUBS_SELECTORS } from './selectors';

@Injectable()
export class ControllerProfileFactoryService { // TODO: refactor, this is a mess
    constructor(
        @Inject(GamepadProfile) private readonly controllerProfiles: readonly GamepadProfile[],
        private readonly keyboardProfile: ControllerProfileKeyboardService,
        private readonly translocoService: TranslocoService,
        private readonly genericGamepadFactory: ControllerProfileGenericGamepadFactoryService,
        private readonly hubProfileFactory: ControllerProfileHubFactoryService,
        private readonly store: Store
    ) {
    }

    public getGamepadProfile(
        gamepad: Gamepad
    ): IControllerProfile<GamepadSettings> {
        const profile = this.controllerProfiles.find((p) => p.controllerIdMatch(gamepad.id));
        if (profile) {
            return profile;
        }
        return this.genericGamepadFactory.fromGamepadAPI(gamepad);
    }

    public getKeyboardProfile(): IControllerProfile<KeyboardSettings> {
        return this.keyboardProfile;
    }

    public getHubProfile(
        hubId: string,
    ): IControllerProfile<HubControllerSettings> {
        const profile = this.hubProfileFactory.build(
            hubId,
        );
        profile.setName(this.store.select(HUBS_SELECTORS.selectHubName(hubId)));
        return profile;
    }

    public getByProfileUid(
        profileUid: string
    ): IControllerProfile<ControllerSettings | null> {
        if (profileUid === this.keyboardProfile.uid) {
            return this.keyboardProfile;
        }
        const profile = this.controllerProfiles.find((p) => p.uid === profileUid);
        if (profile) {
            return profile;
        }
        const hubProfile = this.hubProfileFactory.fromUid(profileUid);
        if (hubProfile) {
            hubProfile.setName(this.store.select(HUBS_SELECTORS.selectHubName(hubProfile.hubId)));
            return hubProfile;
        }

        const genericGamepadProfile = this.genericGamepadFactory.fromUid(profileUid, this.translocoService);
        if (genericGamepadProfile) {
            return genericGamepadProfile;
        }
        throw new Error(`No profile found for uid ${profileUid}`);
    }
}
