import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatFormField, MatLabel, MatOption, MatSelect } from '@angular/material/select';
import { TranslocoPipe } from '@ngneat/transloco';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { InputGain, InputPipeConfig, InputPipeType } from '@app/store';

import { InputPipesPreset } from './input-pipes-preset';
import { InputPipePresetToL10nKeyPipe } from './input-pipe-preset-to-l10n-key.pipe';

@Component({
    standalone: true,
    selector: 'lib-cs-select-input-pipe-preset',
    templateUrl: './select-input-pipe-preset.component.html',
    styleUrls: [ './select-input-pipe-preset.component.scss' ],
    imports: [
        MatSelect,
        MatOption,
        InputPipePresetToL10nKeyPipe,
        TranslocoPipe,
        MatLabel,
        MatFormField,
        ReactiveFormsModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectInputPipePresetComponent {
    @Output() public pipeConfigChange: EventEmitter<InputPipeConfig[]> = new EventEmitter();

    public readonly formControl = this.formBuilder.control<InputPipesPreset>(InputPipesPreset.None, { nonNullable: true });

    private _availablePresets: ReadonlyArray<InputPipesPreset> = [];

    private readonly pipePresets: {[ k in InputPipesPreset ]: () => InputPipeConfig[] } = {
        [InputPipesPreset.None]: () => [],
        [InputPipesPreset.ExponentialGain]: () => [
            { type: InputPipeType.Gain, gain: InputGain.Exponential }
        ],
        [InputPipesPreset.LogarithmicGain]: () => [
            { type: InputPipeType.Gain, gain: InputGain.Logarithmic }
        ]
    };

    constructor(
        private readonly formBuilder: FormBuilder
    ) {
    }

    @Input()
    public set availableInputPipes(
        pipeTypes: ReadonlyArray<InputPipeType> | null
    ) {
        const presets = (pipeTypes ?? []).map((inputPipeType) => {
            switch (inputPipeType) {
                case InputPipeType.Gain:
                    return [
                        InputPipesPreset.LogarithmicGain,
                        InputPipesPreset.ExponentialGain
                    ];
            }
        }).flat();
        this._availablePresets = [ ...new Set([InputPipesPreset.None, ...presets]) ];
    }

    @Input()
    public set currentPipeConfig(c: Readonly<InputPipeConfig[]> | null) {
        const firstPipe = c?.[0];
        if (!firstPipe) {
            this.formControl.setValue(InputPipesPreset.None);
            return;
        }
        switch (firstPipe.type) {
            case InputPipeType.Gain:
                switch (firstPipe.gain) {
                    case InputGain.Linear:
                        this.formControl.setValue(InputPipesPreset.None);
                        break;
                    case InputGain.Exponential:
                        this.formControl.setValue(InputPipesPreset.ExponentialGain);
                        break;
                    case InputGain.Logarithmic:
                        this.formControl.setValue(InputPipesPreset.LogarithmicGain);
                        break;
                }
        }
    }

    public get availablePresets(): ReadonlyArray<InputPipesPreset> {
        return this._availablePresets;
    }

    public onPresetSelect(
        presetType: InputPipesPreset
    ): void {
        const preset = this.pipePresets[presetType]();
        this.pipeConfigChange.emit(preset);
    }
}
