import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatFormField, MatLabel, MatOption, MatSelect } from '@angular/material/select';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { InputPipeConfig, InputPipeType } from '@app/store';

import { InputPipesPreset } from './input-pipes-preset';
import { InputPipePresetToL10nKeyPipe } from './input-pipe-preset-to-l10n-key.pipe';

@Component({
  standalone: true,
  selector: 'lib-cs-select-input-pipe-preset',
  templateUrl: './select-input-pipe-preset.component.html',
  styleUrl: './select-input-pipe-preset.component.scss',
  imports: [
    MatSelect,
    MatOption,
    InputPipePresetToL10nKeyPipe,
    TranslocoPipe,
    MatLabel,
    MatFormField,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectInputPipePresetComponent {
  @Output() public readonly pipeConfigChange: EventEmitter<InputPipeConfig[]> = new EventEmitter();

  public readonly formControl = this.formBuilder.control<InputPipesPreset>(InputPipesPreset.None, {
    nonNullable: true,
  });

  private _availablePresets: ReadonlyArray<InputPipesPreset> = [];

  private readonly pipePresets: { [k in InputPipesPreset]: () => InputPipeConfig[] } = {
    [InputPipesPreset.None]: () => [],
    [InputPipesPreset.ExponentialGain]: () => [{ type: InputPipeType.ExponentialGain }],
    [InputPipesPreset.LogarithmicGain]: () => [{ type: InputPipeType.LogarithmicGain }],
    [InputPipesPreset.OnOffToggle]: () => [{ type: InputPipeType.OnOffToggle }],
    [InputPipesPreset.Pulse1Hz]: () => [{ type: InputPipeType.Pulse, periodMs: 1000, dutyCycle: 0.5 }],
    [InputPipesPreset.Pulse2Hz]: () => [{ type: InputPipeType.Pulse, periodMs: 500, dutyCycle: 0.5 }],
    [InputPipesPreset.Pulse5Hz]: () => [{ type: InputPipeType.Pulse, periodMs: 200, dutyCycle: 0.5 }],
  };

  constructor(private readonly formBuilder: FormBuilder) {}

  @Input()
  public set availableInputPipes(pipeTypes: ReadonlyArray<InputPipeType> | null) {
    const presets = (pipeTypes ?? [])
      .map((inputPipeType) => {
        switch (inputPipeType) {
          case InputPipeType.ExponentialGain:
            return [InputPipesPreset.ExponentialGain];
          case InputPipeType.LogarithmicGain:
            return [InputPipesPreset.LogarithmicGain];
          case InputPipeType.OnOffToggle:
            return [InputPipesPreset.OnOffToggle];
          case InputPipeType.Pulse:
            return [InputPipesPreset.Pulse1Hz, InputPipesPreset.Pulse2Hz, InputPipesPreset.Pulse5Hz];
        }
      })
      .flat();
    this._availablePresets = [...new Set([InputPipesPreset.None, ...presets])];
  }

  @Input()
  public set currentPipeConfig(c: Readonly<InputPipeConfig[]> | null) {
    const firstPipe = c?.[0];
    if (!firstPipe) {
      this.formControl.setValue(InputPipesPreset.None);
      return;
    }
    switch (firstPipe.type) {
      case InputPipeType.LogarithmicGain:
        this.formControl.setValue(InputPipesPreset.ExponentialGain);
        break;
      case InputPipeType.ExponentialGain:
        this.formControl.setValue(InputPipesPreset.LogarithmicGain);
        break;
      case InputPipeType.OnOffToggle:
        this.formControl.setValue(InputPipesPreset.OnOffToggle);
        break;
      case InputPipeType.Pulse:
        this.formControl.setValue(this.findMatchingPulsePreset(firstPipe.periodMs, firstPipe.dutyCycle));
        break;
      default:
        // exhaustiveness check
        this.formControl.setValue(firstPipe satisfies void);
    }
  }

  public get availablePresets(): ReadonlyArray<InputPipesPreset> {
    return this._availablePresets;
  }

  public onPresetSelect(presetType: InputPipesPreset): void {
    const preset = this.pipePresets[presetType]();
    this.pipeConfigChange.emit(preset);
  }

  // this is a temporary solution, presets will be replaced with configurable input pipes
  private findMatchingPulsePreset(periodMs: number, dutyCycle: number): InputPipesPreset {
    const pulsePresets = [InputPipesPreset.Pulse1Hz, InputPipesPreset.Pulse2Hz, InputPipesPreset.Pulse5Hz];
    for (const pulsePreset of pulsePresets) {
      const pipeConfig = this.pipePresets[pulsePreset]()[0];
      if (
        pipeConfig.type === InputPipeType.Pulse &&
        pipeConfig.periodMs === periodMs &&
        pipeConfig.dutyCycle === dutyCycle
      ) {
        return pulsePreset;
      }
    }
    return InputPipesPreset.None;
  }
}
