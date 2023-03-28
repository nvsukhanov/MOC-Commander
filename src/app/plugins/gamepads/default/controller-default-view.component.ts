import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ControllerState, GamepadAxisConfig, GamepadButtonConfig } from '../../../store';
import { NgForOf } from '@angular/common';
import { GamepadView } from '../gamepad-view';
import { TranslocoModule } from '@ngneat/transloco';

type AxisData = {
    index: number;
    value: number;
}

type ButtonData = {
    index: number;
    isPressed: boolean;
}

@Component({
    standalone: true,
    templateUrl: './controller-default-view.component.html',
    styleUrls: [ './controller-default-view.component.scss' ],
    imports: [
        NgForOf,
        TranslocoModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControllerDefaultViewComponent extends GamepadView<AxisData, ButtonData> {
    constructor(
        cdRef: ChangeDetectorRef
    ) {
        super(cdRef);
    }

    protected buildAxesData(config: GamepadAxisConfig[], state: ControllerState): AxisData[] {
        return config.map((axisConfig, index) => ({
            index,

            value: axisConfig.isButton
                   ? state.buttons[axisConfig.buttonIndex]?.value ?? 0
                   : state.axes[axisConfig.index]?.value ?? 0 // state cannot be undefined here
        }));
    }

    protected buildButtonsData(config: GamepadButtonConfig[], state: ControllerState): ButtonData[] {
        return config.map((buttonsConfig, index) => ({
            index,
            isPressed: (state.buttons[buttonsConfig.index]?.value ?? 0) > 0 // state cannot be undefined here
        }));
    }
}
