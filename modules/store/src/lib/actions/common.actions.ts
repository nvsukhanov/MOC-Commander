import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const COMMON_ACTIONS = createActionGroup({
  source: 'Common',
  events: {
    copyToClipboard: props<{ content: string }>(),
    appReady: emptyProps(),
  },
});
