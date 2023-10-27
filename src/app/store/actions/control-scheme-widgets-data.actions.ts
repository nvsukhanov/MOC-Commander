import { createActionGroup, props } from '@ngrx/store';

import { ControlSchemeWidgetsDataModel } from '../models';

export const CONTROL_SCHEME_WIDGETS_DATA_ACTIONS = createActionGroup({
    source: 'Control Scheme Widgets Data',
    events: {
        'Update widget data': props<{ widgetId: number; data: ControlSchemeWidgetsDataModel }>()
    }
});
