import { createSelector } from '@ngrx/store';
import { TiltData } from 'rxpoweredup';
import { WidgetType } from '@app/shared-misc';

import { ATTACHED_IO_PROPS_SELECTORS } from './attached-io-props.selectors';
import { CONTROL_SCHEME_WIDGET_DATA_FEATURE } from '../reducers';
import { TiltWidgetConfigModel } from '../models';

export const CONTROL_SCHEME_WIDGETS_DATA_SELECTORS = {
    selectById: (widgetId: number) => createSelector(
        CONTROL_SCHEME_WIDGET_DATA_FEATURE.selectControlSchemeWidgetsDataState,
        (state) => state.widgetsData[widgetId]
    ),
    selectWidgetTiltData: (widgetConfig: TiltWidgetConfigModel) => createSelector(
        CONTROL_SCHEME_WIDGETS_DATA_SELECTORS.selectById(widgetConfig.id),
        ATTACHED_IO_PROPS_SELECTORS.selectById(widgetConfig),
        (widgetData, attachedIoProps) => {
            if (widgetData?.widgetType === WidgetType.Tilt) {
                const tiltCompensationData: TiltData = attachedIoProps?.runtimeTiltCompensation ?? { yaw: 0, pitch: 0, roll: 0 };
                return {
                    yaw: widgetData.tilt.yaw - tiltCompensationData.yaw,
                    pitch: widgetData.tilt.pitch - tiltCompensationData.pitch,
                    roll: widgetData.tilt.roll - tiltCompensationData.roll
                };
            }
            return undefined;
        }
    ),
} as const;

