import { ControllerInputType } from '@app/shared';

export type ControllerInputModel = {
    controllerId: string;
    inputType: ControllerInputType;
    inputId: string;
    rawValue: number;
    value: number;
    timestamp: number;
};
