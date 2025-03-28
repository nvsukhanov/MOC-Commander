import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Language } from '@app/shared-i18n';

import { GamepadPollingRate, UserSelectedTheme } from '../models';
import { IState } from '../i-state';

export const SETTINGS_ACTIONS = createActionGroup({
  source: 'Settings',
  events: {
    setTheme: props<{ appTheme: UserSelectedTheme }>(),
    setLanguage: props<{ language: Language }>(),
    setLinuxCompat: props<{ useLinuxCompat: boolean }>(),
    setGamepadPollingRate: props<{ gamepadPollingRate: GamepadPollingRate }>(),
    createStateBackup: emptyProps(),
    restoreStateFromBackup: props<{ state: IState }>(),
    resetState: emptyProps(),
  },
});
