import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ControllerState, GamepadAxisConfig, GamepadButtonConfig } from '../../../store';
import { L10nPipe, L10nService } from '../../../l10n';
import { GamepadView } from '../gamepad-view';
import { NgForOf } from '@angular/common';

type AxisData = {
    l10nKey: keyof L10nService;
    value: number;
}

type ButtonData = {
    l10nKey: keyof L10nService;
    isPressed: boolean;
}

@Component({
    standalone: true,
    templateUrl: './controller-xbox360-view.component.html',
    styleUrls: [ './controller-xbox360-view.component.scss' ],
    imports: [
        NgForOf,
        L10nPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControllerXbox360ViewComponent extends GamepadView<AxisData, ButtonData> {
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
