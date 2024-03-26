import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const SHOW_NOTIFICATION_ACTIONS = createActionGroup({
    source: 'Show Notification',
    events: {
        error: props<{ l10nKey: string; l10nPayload?: object }>(),
        genericError: props<{ error: Error }>(),
        info: props<{ l10nKey: string; l10nPayload?: object }>(),
        appUpdated: emptyProps()
    }
});
