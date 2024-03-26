import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatOption } from '@angular/material/autocomplete';
import { MatSelect } from '@angular/material/select';
import { TranslocoPipe } from '@ngneat/transloco';
import { MatTooltip } from '@angular/material/tooltip';
import { GamepadPollingRate } from '@app/store';

@Component({
    standalone: true,
    selector: 'page-settings-gamepad-polling-rate',
    templateUrl: './gamepad-polling-rate.component.html',
    styleUrls: [ './gamepad-polling-rate.component.scss' ],
    imports: [
        MatFormField,
        MatIcon,
        MatLabel,
        MatOption,
        MatSelect,
        TranslocoPipe,
        MatTooltip
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GamepadPollingRateComponent {
    public readonly gamepadPollingRate = input.required<GamepadPollingRate>();

    public readonly gamepadPollingRateChange = output<GamepadPollingRate>();

    public readonly lowPollingRate = GamepadPollingRate.Low;

    public readonly defaultPollingRate = GamepadPollingRate.Default;

    public onGamepadPollingRateChange(
        value: GamepadPollingRate
    ): void {
        this.gamepadPollingRateChange.emit(value);
    }
}
