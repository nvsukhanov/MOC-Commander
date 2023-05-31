import { createActionGroup, props } from '@ngrx/store';
import { ControllerSettings } from '../i-state';

export const CONTROLLER_SETTINGS_ACTIONS = createActionGroup({
    source: 'Controller Settings',
    events: {
        'update settings': props<{ settings: ControllerSettings }>()
    }
});
