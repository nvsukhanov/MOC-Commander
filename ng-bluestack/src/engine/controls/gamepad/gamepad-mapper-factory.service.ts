import { Inject, Injectable } from '@angular/core';
import { IControlMapper } from '../i-control-mapper';
import { GamepadMapper } from './gamepad-mapper';
import { ExtractTokenType, NAVIGATOR } from '../../../app/types';
import { ExampleGamepadProfileService } from './example-gamepad-profile.service';
import { IGamepadProfile } from './i-gamepad-profile';

@Injectable()
export class GamepadMapperFactoryService {
    constructor(
        @Inject(NAVIGATOR) private readonly navigator: ExtractTokenType<typeof NAVIGATOR>,
        @Inject(ExampleGamepadProfileService) private readonly profile: IGamepadProfile
    ) {
    }

    public create(
        gamepadId: number,
    ): IControlMapper {
        return new GamepadMapper(gamepadId, this.navigator, this.profile);
    }
}
