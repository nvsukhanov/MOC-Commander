import { Inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

import { ControllerProfileGenericGamepad } from './controller-profile-generic-gamepad';
import { ControllerProfileGenericGamepadUidBuilderService } from './controller-profile-generic-gamepad-uid-builder.service';
import { CONTROLLERS_CONFIG, IControllersConfig } from '../i-controllers-config';

@Injectable()
export class ControllerProfileGenericGamepadFactoryService {
    constructor(
        private readonly transloco: TranslocoService,
        @Inject(CONTROLLERS_CONFIG) private readonly config: IControllersConfig,
        private readonly uidBuilder: ControllerProfileGenericGamepadUidBuilderService
    ) {
    }

    public fromGamepadAPI(
        gamepad: Gamepad
    ): ControllerProfileGenericGamepad {
        return new ControllerProfileGenericGamepad(
            this.uidBuilder.buildUid(gamepad.id, gamepad.axes.length, gamepad.buttons.length),
            gamepad.axes.length,
            gamepad.buttons.length,
            this.transloco,
            this.config
        );
    }

    public fromUid(
        uid: string,
        transloco: TranslocoService
    ): ControllerProfileGenericGamepad | null {
        const parsedUid = this.uidBuilder.parseUid(uid);
        if (!parsedUid) {
            return null;
        }
        return new ControllerProfileGenericGamepad(
            uid,
            parsedUid.axesCount,
            parsedUid.buttonsCount,
            transloco,
            this.config
        );
    }
}
