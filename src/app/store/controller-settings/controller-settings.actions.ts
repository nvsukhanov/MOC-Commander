import { createActionGroup, props } from '@ngrx/store';

import { ControllerSettingsModel } from './controller-settings.model';

export const CONTROLLER_SETTINGS_ACTIONS = createActionGroup({
    source: 'Controller Settings',
    events: {
        'update settings': props<{ settings: ControllerSettingsModel }>()
    }
});
