import { ControllerInputType, ControllerType, transformRawInputValue } from '@app/controller-profiles';

import { ControllerInputModel, ControllerSettingsModel } from '../models';

export function transformControllerInputValue(
    inputModel: ControllerInputModel,
    settings: ControllerSettingsModel
): number {
    if (settings.ignoreInput) {
        return 0;
    }
    switch (settings.controllerType) {
        case ControllerType.Keyboard:
        case ControllerType.Hub:
            return transformRawInputValue(inputModel.rawValue);
        case ControllerType.Gamepad:
            if (inputModel.inputType === ControllerInputType.Button) {
                return transformRawInputValue(inputModel.rawValue, settings.buttonConfigs[inputModel.inputId]);
            }
            return transformRawInputValue(inputModel.rawValue, settings.axisConfigs[inputModel.inputId]);
    }
}
