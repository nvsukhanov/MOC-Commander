import { ControllerState, GamepadAxisConfig, GamepadButtonConfig, GamepadControllerConfig } from '../../store';
import { ChangeDetectorRef } from '@angular/core';

export abstract class GamepadView<TAxisData = unknown, TButtonData = unknown> {
    protected abstract cdRef: ChangeDetectorRef

    private configuration?: GamepadControllerConfig;

    private state?: ControllerState;

    private axisData: TAxisData[] = [];

    private buttonsData: TButtonData[] = [];

    public get axes(): ReadonlyArray<Readonly<TAxisData>> {
        return this.axisData;
    }

    public get buttons(): ReadonlyArray<Readonly<TButtonData>> {
        return this.buttonsData;
    }

    public writeConfiguration(config: GamepadControllerConfig): void {
        this.configuration = config;
        this.updateData();
    }

    public writeGamepadState(state: ControllerState): void {
        this.state = state;
        this.updateData();
    }

    protected abstract buildAxesData(config: GamepadAxisConfig[], state: ControllerState): TAxisData[];

    protected abstract buildButtonsData(config: GamepadButtonConfig[], state: ControllerState): TButtonData[];

    private updateData(): void {
        if (this.configuration && this.state) {
            this.axisData = this.buildAxesData(this.configuration.axes, this.state);
            this.buttonsData = this.buildButtonsData(this.configuration.buttons, this.state);
        } else {
            this.axisData = [];
            this.buttonsData = [];
        }
        this.cdRef.markForCheck();
    }
}
