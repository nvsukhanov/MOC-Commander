export type ControllerState = ControllerButtonState | ControllerAxisState;

export type ControllerButtonState = {
    readonly type: 'button',
    readonly code: number;
    readonly value: number;
}

export type ControllerAxisState = {
    readonly type: 'axis',
    readonly name: string;
    readonly value: number;
}
