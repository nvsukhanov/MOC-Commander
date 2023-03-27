import { ControllerType } from '../store';
import { CONFIGURE_CONTROLLER_I18N_SCOPE } from '../i18n';

export const MAPPING_CONTROLLER_TO_L10N: Readonly<{ [type in ControllerType]: string }> = {
    [ControllerType.Unassigned]: [ CONFIGURE_CONTROLLER_I18N_SCOPE, 'typeUnassigned' ].join('.'),
    [ControllerType.GamePad]: [ CONFIGURE_CONTROLLER_I18N_SCOPE, 'typeGamepad' ].join('.'),
    [ControllerType.Keyboard]: [ CONFIGURE_CONTROLLER_I18N_SCOPE, 'typeKeyboard' ].join('.')
};
