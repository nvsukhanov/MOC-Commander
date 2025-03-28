import { createActionGroup, props } from '@ngrx/store';

export const APP_UPDATE_ACTIONS = createActionGroup({
  source: 'App Update',
  events: {
    appUpdated: props<{ prev: string; current: string }>(),
  },
});
