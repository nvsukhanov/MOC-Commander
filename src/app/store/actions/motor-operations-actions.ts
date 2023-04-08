import { createActionGroup, props } from '@ngrx/store';
import { MotorProfile, PortOperationCompletionInformation, PortOperationStartupInformation } from '../../lego-hub';

export const MOTOR_OPERATIONS_ACTIONS = createActionGroup({
    source: 'MOTOR_OPERATIONS_ACTIONS',
    events: {
        'set motor speed': props<{
            portId: number,
            speed: number,
            power?: number,
            profile?: MotorProfile,
            startupMode?: PortOperationStartupInformation,
            completionMode?: PortOperationCompletionInformation
        }>(),
    }
});
