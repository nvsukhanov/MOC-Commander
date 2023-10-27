import { createFeature, createReducer, on } from '@ngrx/store';
import { CONTROL_SCHEME_ACTIONS, CONTROL_SCHEME_WIDGETS_DATA_ACTIONS } from '@app/store';

import { ControlSchemeWidgetsDataModel } from '../models';

export type ControlSchemeWidgetsDataState = {
    widgetsData: { [widgetIndex in number]?: ControlSchemeWidgetsDataModel };
};

export const CONTROL_SCHEME_WIDGET_DATA_FEATURE = createFeature({
    name: 'controlSchemeWidgetsData',
    reducer: createReducer(
        {
            widgetsData: {}
        } as ControlSchemeWidgetsDataState,
        on(CONTROL_SCHEME_ACTIONS.startScheme, CONTROL_SCHEME_ACTIONS.schemeStopped, (): ControlSchemeWidgetsDataState => ({ widgetsData: {} })),
        on(CONTROL_SCHEME_WIDGETS_DATA_ACTIONS.updateWidgetData, (state, { widgetId, data }): ControlSchemeWidgetsDataState => {
            return {
                ...state,
                widgetsData: {
                    ...state.widgetsData,
                    [widgetId]: data
                }
            };
        }),
    )
});
