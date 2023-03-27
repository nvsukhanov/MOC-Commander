import { toCamelCase } from '@ngneat/transloco';
import { GAMEPAD_PLUGINS_I18N_SCOPE } from '../../i18n';

export function createGamepadL10nKey(key: string): string {
    return [ toCamelCase(GAMEPAD_PLUGINS_I18N_SCOPE), key ].join('.');
}
