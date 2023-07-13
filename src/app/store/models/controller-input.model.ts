import { ControllerInputType } from '@app/shared';

export type ControllerInputModel = {
    controllerId: string;
    inputType: ControllerInputType;
    inputId: string;
    value: number;
};
