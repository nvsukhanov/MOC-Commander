import { createSelector } from '@ngrx/store';
import { PortModeName } from 'rxpoweredup';

import { BINDING_EDIT_COMMON_SELECTORS } from '../common';

export const BINDING_SERVO_EDIT_SELECTORS = {
    canCalibrateServo: ({ hubId, portId }: { hubId: string; portId: number }) => createSelector(
        BINDING_EDIT_COMMON_SELECTORS.canRequestPortValue({ hubId, portId, portModeName: PortModeName.position }),
        BINDING_EDIT_COMMON_SELECTORS.canRequestPortValue({ hubId, portId, portModeName: PortModeName.absolutePosition }),
        (canRequestPosition, canRequestAbsolutePosition): boolean => {
            return canRequestPosition && canRequestAbsolutePosition;
        }
    ),
} as const;
