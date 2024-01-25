import { Inject, Injectable, Optional } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Memoize } from 'typescript-memoize';

import { ControllerProfileGenericGamepadFactoryService } from './gamepad';
import { UnknownControllerProfileFactoryService } from './unknown-controller';
import { GamepadProfile } from './gamepad-profile';
import { IControllerProfile } from './i-controller-profile';
import { GamepadSettings } from './controller-settings';

@Injectable()
export class GamepadProfileFactoryService {
    constructor(
        private readonly genericGamepadFactory: ControllerProfileGenericGamepadFactoryService,
        private readonly unknownControllerProfileFactory: UnknownControllerProfileFactoryService,
        private readonly translocoService: TranslocoService,
        @Optional() @Inject(GamepadProfile) private readonly controllerProfiles?: readonly GamepadProfile[],
    ) {
    }

    @Memoize()
    public getGamepadProfile(
        gamepad: Gamepad
    ): IControllerProfile<GamepadSettings> {
        const profile = this.controllerProfiles?.find((p) => p.controllerIdMatch(gamepad.id));
        if (profile) {
            return profile;
        }
        return this.genericGamepadFactory.fromGamepadAPI(gamepad);
    }

    public getByProfileUid(
        profileUid: string
    ): IControllerProfile<GamepadSettings | null> {
        const profile = this.controllerProfiles?.find((p) => p.uid === profileUid);
        if (profile) {
            return profile;
        }
        const genericGamepadProfile = this.genericGamepadFactory.fromUid(profileUid, this.translocoService);
        if (genericGamepadProfile) {
            return genericGamepadProfile;
        }
        return this.unknownControllerProfileFactory.fromUid(profileUid);
    }
}
