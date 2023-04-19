import { HubIoOperationMode } from '../store/hub-io-operation-mode';

export const MAPPING_HUB_IO_OPERATION_MODE_TO_L10N: { [k in HubIoOperationMode]: string } = {
    [HubIoOperationMode.Linear]: 'hubIOOperationModeLinear',
    [HubIoOperationMode.Servo]: 'hubIOOperationModeServo',
    [HubIoOperationMode.SetColor]: 'hubIOOperationModeSetColor',
} as const;
