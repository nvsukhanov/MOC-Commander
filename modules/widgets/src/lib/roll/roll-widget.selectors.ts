/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createSelector } from '@ngrx/store';
import { CONTROL_SCHEME_WIDGETS_DATA_SELECTORS, RollWidgetConfigModel } from '@app/store';

export const SELECT_ROLL_WIDGET_DATA = (config: RollWidgetConfigModel) => createSelector(
    CONTROL_SCHEME_WIDGETS_DATA_SELECTORS.selectWidgetTiltData(config),
    (widgetData) => widgetData?.roll ?? null
);
