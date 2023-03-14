import { IControlMapper } from '../i-control-mapper';
import { IControlAction } from '../i-control-action';
import { ExtractTokenType, NAVIGATOR } from '../../../app/types';
import { IGamepadProfile } from './i-gamepad-profile';

export class GamepadMapper implements IControlMapper {
    constructor(
        private readonly gamepadId: number,
        private readonly navigator: ExtractTokenType<typeof NAVIGATOR>,
        private readonly profile: IGamepadProfile
    ) {
    }

    public getCurrentControls(): IControlAction | null {
        const gamepad = this.navigator.getGamepads()[this.gamepadId];
        if (!gamepad) {
            return null;
        }
        return this.profile.apply(gamepad);
    }
}
