import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Language } from '@app/shared';

import { UserSelectedTheme } from '../models';
import { IState } from '../i-state';

export const SETTINGS_ACTIONS = createActionGroup({
    source: 'Settings',
    events: {
        'set theme': props<{ appTheme: UserSelectedTheme }>(),
        'set language': props<{ language: Language }>(),
        'create state backup': emptyProps(),
        'restore state from backup': props<{ state: IState }>(),
        'reset state': emptyProps(),
    }
});
