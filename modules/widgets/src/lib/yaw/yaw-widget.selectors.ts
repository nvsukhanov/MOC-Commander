/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createSelector } from '@ngrx/store';
import { CONTROL_SCHEME_WIDGETS_DATA_SELECTORS, YawWidgetConfigModel } from '@app/store';

export const SELECT_YAW_WIDGET_DATA = (config: YawWidgetConfigModel) => createSelector(
    CONTROL_SCHEME_WIDGETS_DATA_SELECTORS.selectWidgetTiltData(config),
    (widgetData) => widgetData?.yaw ?? null
);
