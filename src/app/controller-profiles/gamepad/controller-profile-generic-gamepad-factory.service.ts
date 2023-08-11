import { Inject, Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { APP_CONFIG, IAppConfig } from '@app/shared';

import { ControllerProfileGenericGamepad } from './controller-profile-generic-gamepad';

@Injectable()
export class ControllerProfileGenericGamepadFactoryService {
    constructor(
        private readonly transloco: TranslocoService,
        @Inject(APP_CONFIG) private readonly appConfig: IAppConfig
    ) {
    }

    public fromGamepadAPI(
        gamepad: Gamepad
    ): ControllerProfileGenericGamepad {
        return new ControllerProfileGenericGamepad(
            this.buildUid(gamepad.id, gamepad.axes.length, gamepad.buttons.length),
            gamepad.axes.length,
            this.transloco,
            this.appConfig
        );
    }

    public fromUid(
        uid: string,
        transloco: TranslocoService
    ): ControllerProfileGenericGamepad | null {
        const parsedUid = this.parseUid(uid);
        if (!parsedUid) {
            return null;
        }
        return new ControllerProfileGenericGamepad(
            uid,
            parsedUid.axesCount,
            transloco,
            this.appConfig
        );
    }

    private buildUid(
        id: string,
        axesCount: number,
        buttonsCount: number
    ): string {
        const clearId = id.replace(/[^a-zA-Z0-9]/g, '');
        return `[${clearId}][a${axesCount}][b${buttonsCount}]`;
    }

    private parseUid(
        uid: string
    ): { axesCount: number; buttonsCount: number } | null {
        const match = uid.match(/^\[([a-zA-Z0-9]*)\]\[a(\d+)\]\[b(\d+)\]$/);
        if (!match) {
            return null;
        }
        return {
            axesCount: parseInt(match[1], 10),
            buttonsCount: parseInt(match[2], 10)
        };
    }
}
