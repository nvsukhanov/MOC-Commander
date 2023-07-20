import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { ControlSchemeV2Model } from '../models';

export const CONTROL_SCHEME_V2_ACTIONS = createActionGroup({
    source: 'Control Schemes v2',
    events: {
        'create': props<{ scheme: ControlSchemeV2Model }>(),
        'update': props<{ scheme: ControlSchemeV2Model }>(),
        'delete': props<{ id: string }>(),

        'start scheme': props<{ schemeId: string }>(),
        'stop scheme': emptyProps(),

        'servo calibration error': props<{ error: Error }>(),
    }
});
