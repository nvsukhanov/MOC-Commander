import { createSelector } from '@ngrx/store';
import { CONTROL_SCHEME_WIDGET_DATA_FEATURE } from '@app/store';

export const CONTROL_SCHEME_WIDGETS_DATA_SELECTORS = {
    selectById: (widgetIndex: number) => createSelector(
        CONTROL_SCHEME_WIDGET_DATA_FEATURE.selectControlSchemeWidgetsDataState,
        (state) => state.widgetsData[widgetIndex]
    )
} as const;

