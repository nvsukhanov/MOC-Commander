import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { ControlSchemeBinding, ControlSchemeModel, ControlSchemePortConfig, WidgetConfigModel } from '../models';

export const CONTROL_SCHEME_ACTIONS = createActionGroup({
    source: 'Control Schemes',
    events: {
        createControlScheme: props<{ name: string }>(),
        updateControlSchemeName: props<{ previousName: string; name: string }>(),
        deleteControlScheme: props<{ name: string }>(),
        importControlScheme: props<{ scheme: ControlSchemeModel }>(),

        saveBinding: props<{ schemeName: string; binding: ControlSchemeBinding }>(),
        createBinding: props<{ schemeName: string; binding: ControlSchemeBinding }>(),
        deleteBinding: props<{ schemeName: string; bindingId: number }>(),
        savePortConfig: props<{ schemeName: string; portConfig: ControlSchemePortConfig }>(),

        startScheme: props<{ name: string }>(),
        schemeStarted: props<{ name: string }>(),
        schemeStartFailed: props<{ reason: Error }>(),
        stopScheme: emptyProps(),
        schemeStopped: emptyProps(),

        servoCalibrationError: props<{ error: Error }>(),
        addWidget: props<{ schemeName: string; widgetConfig: Omit<WidgetConfigModel, 'id'> }>(),
        deleteWidget: props<{ schemeName: string; widgetId: number }>(),
        updateWidget: props<{ schemeName: string; widgetConfig: WidgetConfigModel }>(),
        reorderWidgets: props<{ schemeName: string; widgets: WidgetConfigModel[] }>(),
    }
});
