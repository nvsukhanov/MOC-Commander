import { createActionGroup, props } from '@ngrx/store';

import { ControllerSettingsModel } from '../models';

export const CONTROLLER_SETTINGS_ACTIONS = createActionGroup({
    source: 'Controller Settings',
    events: {
        updateSettings: props<{ settings: ControllerSettingsModel }>()
    }
});
