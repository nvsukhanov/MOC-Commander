import { createSelector } from '@ngrx/store';
import { TiltData } from 'rxpoweredup';
import { WidgetType } from '@app/shared-misc';

import { ATTACHED_IO_PROPS_SELECTORS } from './attached-io-props.selectors';
import { CONTROL_SCHEME_WIDGET_DATA_FEATURE } from '../reducers';

export const CONTROL_SCHEME_WIDGETS_DATA_SELECTORS = {
  selectById: (widgetId: number) =>
    createSelector(
      CONTROL_SCHEME_WIDGET_DATA_FEATURE.selectControlSchemeWidgetsDataState,
      (state) => state.widgetsData[widgetId],
    ),
  selectWidgetTiltData: ({ id, hubId, portId }: { id: number; hubId: string; portId: number }) =>
    createSelector(
      CONTROL_SCHEME_WIDGETS_DATA_SELECTORS.selectById(id),
      ATTACHED_IO_PROPS_SELECTORS.selectById({ hubId, portId }),
      (widgetData, attachedIoProps) => {
        if (
          widgetData?.widgetType === WidgetType.Yaw ||
          widgetData?.widgetType === WidgetType.Pitch ||
          widgetData?.widgetType === WidgetType.Roll
        ) {
          const tiltCompensationData: TiltData = attachedIoProps?.runtimeTiltCompensation ?? {
            yaw: 0,
            pitch: 0,
            roll: 0,
          };
          return {
            yaw: widgetData.tilt.yaw - tiltCompensationData.yaw,
            pitch: widgetData.tilt.pitch - tiltCompensationData.pitch,
            roll: widgetData.tilt.roll - tiltCompensationData.roll,
          };
        }
        return undefined;
      },
    ),
} as const;
