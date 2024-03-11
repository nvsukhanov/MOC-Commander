/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createSelector } from '@ngrx/store';
import { CONTROL_SCHEME_WIDGETS_DATA_SELECTORS, PitchWidgetConfigModel } from '@app/store';

export const SELECT_PITCH_WIDGET_DATA = (config: PitchWidgetConfigModel) => createSelector(
    CONTROL_SCHEME_WIDGETS_DATA_SELECTORS.selectWidgetTiltData(config),
    (widgetData) => widgetData?.pitch ?? null
);
