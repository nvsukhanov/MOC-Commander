import { createActionGroup, props } from '@ngrx/store';

export const APP_UPDATE_ACTIONS = createActionGroup({
    source: 'App Update',
    events: {
        'app updated': props<{ prev: string; current: string }>()
    }
});
