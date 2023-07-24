import { createActionGroup, props } from '@ngrx/store';

import { UserSelectedTheme } from '../models';

export const SETTINGS_ACTIONS = createActionGroup({
    source: 'Settings',
    events: {
        setTheme: props<{ theme: UserSelectedTheme }>()
    }
});
