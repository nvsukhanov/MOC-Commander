export type ControllerState = ControllerButtonState | ControllerAxisState;

export type ControllerButtonState = {
    readonly type: 'button',
    readonly index: number;
    readonly value: number;
}

export type ControllerAxisState = {
    readonly type: 'axis',
    readonly index: number;
    readonly value: number;
}
