import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatOption } from '@angular/material/autocomplete';
import { MatSelect } from '@angular/material/select';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { GamepadPollingRate } from '@app/store';

@Component({
  standalone: true,
  selector: 'page-settings-gamepad-polling-rate',
  templateUrl: './gamepad-polling-rate.component.html',
  styleUrl: './gamepad-polling-rate.component.scss',
  imports: [MatFormField, MatLabel, MatOption, MatSelect, TranslocoPipe, MatIcon, MatTooltip, MatSuffix],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamepadPollingRateComponent {
  public readonly gamepadPollingRate = input.required<GamepadPollingRate>();

  public readonly gamepadPollingRateChange = output<GamepadPollingRate>();

  public readonly lowPollingRate = GamepadPollingRate.Low;

  public readonly defaultPollingRate = GamepadPollingRate.Default;

  public onGamepadPollingRateChange(value: GamepadPollingRate): void {
    this.gamepadPollingRateChange.emit(value);
  }
}
