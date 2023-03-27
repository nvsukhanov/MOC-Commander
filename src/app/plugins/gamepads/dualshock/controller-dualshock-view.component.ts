import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ControllerState, GamepadAxisConfig, GamepadButtonConfig } from '../../../store';
import { GamepadView } from '../gamepad-view';
import { NgForOf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

type AxisData = {
    l10nKey: string;
    value: number;
}

type ButtonData = {
    l10nKey: string;
    isPressed: boolean;
}

@Component({
    standalone: true,
    templateUrl: './controller-dualshock-view.component.html',
    styleUrls: [ './controller-dualshock-view.component.scss' ],
    imports: [
        NgForOf,
        TranslocoModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControllerDualshockViewComponent extends GamepadView<AxisData, ButtonData> {
    constructor(
        protected readonly cdRef: ChangeDetectorRef
    ) {
        super();
    }

    protected buildAxesData(config: GamepadAxisConfig[], state: ControllerState): AxisData[] {
        return config.map((axis) => ({
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            l10nKey: axis.nameL10nKey!, // always defined, TODO: can be fixed by stricter service typing
            value: axis.isButton ? state.buttons[axis.buttonIndex]?.value : state.axes[axis.index]?.value
        }));
    }

    protected buildButtonsData(config: GamepadButtonConfig[], state: ControllerState): ButtonData[] {
        return config.map((button) => ({
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            l10nKey: button.nameL10nKey!, // always defined, TODO: can be fixed by stricter service typing
            isPressed: (state.buttons[button.index]?.value ?? 0) > 0
        }));
    }

}
