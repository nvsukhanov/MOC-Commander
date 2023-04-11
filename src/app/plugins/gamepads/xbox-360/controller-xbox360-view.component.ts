import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { GamepadAxisConfig, GamepadAxisState, GamepadButtonConfig, GamepadButtonState, GamepadButtonType } from '../../../store';
import { GamepadView } from '../gamepad-view';
import { NgForOf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

type AxisData = {
    l10nKey: string;
    value: number;
}

type ButtonData = {
    l10nKey: string;
    value: number;
    isTrigger: boolean;
}

@Component({
    standalone: true,
    templateUrl: './controller-xbox360-view.component.html',
    styleUrls: [ './controller-xbox360-view.component.scss' ],
    imports: [
        NgForOf,
        TranslocoModule,
        NgSwitch,
        NgSwitchCase,
        NgSwitchDefault
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControllerXbox360ViewComponent extends GamepadView<AxisData, ButtonData> {
    constructor(
        cdRef: ChangeDetectorRef
    ) {
        super(cdRef);
    }

    protected buildAxesData(config: GamepadAxisConfig[], state: GamepadAxisState[]): AxisData[] {
        return state.map((axis) => ({
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            l10nKey: config[axis.axisIndex].nameL10nKey!, // always defined, TODO: can be fixed by stricter service typing
            value: axis.value
        }));
    }

    protected buildButtonsData(config: GamepadButtonConfig[], state: GamepadButtonState[]): ButtonData[] {
        return state.map((button) => ({
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            l10nKey: config[button.buttonIndex].nameL10nKey!, // always defined, TODO: can be fixed by stricter service typing
            value: button.value,
            isTrigger: config[button.buttonIndex].buttonType === GamepadButtonType.Trigger
        }));
    }
}
