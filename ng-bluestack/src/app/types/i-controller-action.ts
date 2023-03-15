export type ControllerAction = ControllerButtonAction | ControllerAxisAction;

export type ControllerButtonAction = {
    readonly type: 'button',
    readonly code: number;
    readonly modifier?: number;
}

export type ControllerAxisAction = {
    readonly type: 'axis',
    readonly name: string;
    readonly value: number;
}
