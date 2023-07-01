import { BindingForm } from './edit';
import { ControlSchemeBinding } from '../store';
import { HubIoOperationMode } from '@app/shared';

export function trimFormOutputBinding(
    source: ReturnType<BindingForm['getRawValue']>
): ControlSchemeBinding {
    switch (source.output.operationMode) {
        case HubIoOperationMode.Linear:
            return {
                ...source,
                output: {
                    hubId: source.output.hubId,
                    portId: source.output.portId,
                    operationMode: HubIoOperationMode.Linear,
                    linearConfig: source.output.linearConfig
                }
            };
        case HubIoOperationMode.Servo:
            return {
                ...source,
                output: {
                    hubId: source.output.hubId,
                    portId: source.output.portId,
                    operationMode: HubIoOperationMode.Servo,
                    servoConfig: source.output.servoConfig
                }
            };
        case HubIoOperationMode.SetAngle:
            return {
                ...source,
                output: {
                    hubId: source.output.hubId,
                    portId: source.output.portId,
                    operationMode: HubIoOperationMode.SetAngle,
                    setAngleConfig: source.output.setAngleConfig
                }
            };
        default:
            throw new Error(`Unexpected operation mode: ${source.output.operationMode}`);
    }
}
