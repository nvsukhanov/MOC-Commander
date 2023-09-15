import { createActionGroup, props } from '@ngrx/store';
import { Language } from '@app/shared';

import { UserSelectedTheme } from '../models';

export const SETTINGS_ACTIONS = createActionGroup({
    source: 'Settings',
    events: {
        'set theme': props<{ appTheme: UserSelectedTheme }>(),
        'set language': props<{ language: Language }>()
    }
});
