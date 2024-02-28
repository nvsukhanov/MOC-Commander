import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { ControlSchemeBinding, ControlSchemeModel, ControlSchemePortConfig, WidgetConfigModel } from '../models';

export const CONTROL_SCHEME_ACTIONS = createActionGroup({
    source: 'Control Schemes',
    events: {
        'create control scheme': props<{ name: string }>(),
        'update control scheme name': props<{ previousName: string; name: string }>(),
        'delete control scheme': props<{ name: string }>(),
        'import control scheme': props<{ scheme: ControlSchemeModel }>(),

        'save binding': props<{ schemeName: string; binding: ControlSchemeBinding }>(),
        'create binding': props<{ schemeName: string; binding: ControlSchemeBinding }>(),
        'delete binding': props<{ schemeName: string; bindingId: number }>(),
        'save port config': props<{ schemeName: string; portConfig: ControlSchemePortConfig }>(),

        'start scheme': props<{ name: string }>(),
        'scheme started': props<{ name: string }>(),
        'scheme start failed': props<{ reason: Error }>(),
        'stop scheme': emptyProps(),
        'scheme stopped': emptyProps(),

        'servo calibration error': props<{ error: Error }>(),
        'add widget': props<{ schemeName: string; widgetConfig: Omit<WidgetConfigModel, 'id'> }>(),
        'delete widget': props<{ schemeName: string; widgetId: number }>(),
        'update widget': props<{ schemeName: string; widgetConfig: WidgetConfigModel }>(),
        'reorder widgets': props<{ schemeName: string; widgets: WidgetConfigModel[] }>(),
    }
});
