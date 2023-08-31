import { createActionGroup, props } from '@ngrx/store';

import { UserSelectedTheme } from '../models';
import { Language } from '../../i18n';

export const SETTINGS_ACTIONS = createActionGroup({
    source: 'Settings',
    events: {
        'set theme': props<{ theme: UserSelectedTheme }>(),
        'set language': props<{ language: Language }>()
    }
});
