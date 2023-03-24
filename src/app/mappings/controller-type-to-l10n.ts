import { ControllerType } from '../store';
import { L10nService } from '../l10n';

export const MAPPING_CONTROLLER_TO_L10N: Readonly<{ [type in ControllerType]: keyof L10nService }> = {
    [ControllerType.Unassigned]: 'controllerTypeUnassigned$',
    [ControllerType.GamePad]: 'controllerTypeGamepad$',
    [ControllerType.Keyboard]: 'controllerTypeKeyboard$',
};
