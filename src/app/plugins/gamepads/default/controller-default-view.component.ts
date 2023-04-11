import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { GamepadAxisConfig, GamepadAxisState, GamepadButtonConfig, GamepadButtonState } from '../../../store';
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

    protected buildAxesData(config: GamepadAxisConfig[], state: GamepadAxisState[]): AxisData[] {
        return state.map((axisState) => ({ index: axisState.axisIndex, value: axisState.value }));
    }

    protected buildButtonsData(config: GamepadButtonConfig[], state: GamepadButtonState[]): ButtonData[] {
        return state.map((buttonState) => ({ index: buttonState.buttonIndex, isPressed: buttonState.value > 0 }));
    }
}
