import { GamepadAxisConfig, GamepadAxisState, GamepadButtonConfig, GamepadButtonState, GamepadConfig } from '../../store';
import { ChangeDetectorRef } from '@angular/core';

export abstract class GamepadView<TAxisData = unknown, TButtonData = unknown> {

    private configuration?: GamepadConfig;

    private axisState?: GamepadAxisState[];

    private buttonState?: GamepadButtonState[];

    private axisData: TAxisData[] = [];

    private buttonsData: TButtonData[] = [];

    protected constructor(
        private readonly cdRef: ChangeDetectorRef
    ) {
    }

    protected abstract buildAxesData(config: GamepadAxisConfig[], state: GamepadAxisState[]): TAxisData[];

    protected abstract buildButtonsData(config: GamepadButtonConfig[], state: GamepadButtonState[]): TButtonData[];

    public get axes(): ReadonlyArray<Readonly<TAxisData>> {
        return this.axisData;
    }

    public get buttons(): ReadonlyArray<Readonly<TButtonData>> {
        return this.buttonsData;
    }

    public writeConfiguration(config: GamepadConfig): void {
        this.configuration = config;
        this.updateData();
    }

    public writeGamepadState(axisState: GamepadAxisState[], buttonState: GamepadButtonState[]): void {
        this.axisState = axisState;
        this.buttonState = buttonState;
        this.updateData();
    }

    private updateData(): void {
        if (this.configuration && this.axisState && this.buttonState) {
            this.axisData = this.buildAxesData(this.configuration.axes, this.axisState);
            this.buttonsData = this.buildButtonsData(this.configuration.buttons, this.buttonState);
        } else {
            this.axisData = [];
            this.buttonsData = [];
        }
        this.cdRef.markForCheck();
    }
}
