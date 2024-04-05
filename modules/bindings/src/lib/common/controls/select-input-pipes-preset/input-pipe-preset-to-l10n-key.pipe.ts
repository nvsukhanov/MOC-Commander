import { Pipe, PipeTransform } from '@angular/core';

import { InputPipesPreset } from './input-pipes-preset';

@Pipe({
    standalone: true,
    name: 'inputPipePresetToL10nKey',
    pure: true
})
export class InputPipePresetToL10nKeyPipe implements PipeTransform {
    private readonly keyMap: {[key in InputPipesPreset]: string} = {
        [InputPipesPreset.None]: 'controlScheme.inputSettings.inputPipesPresetNone',
        [InputPipesPreset.LogarithmicGain]: 'controlScheme.inputSettings.inputPipesPresetExponentialGain',
        [InputPipesPreset.ExponentialGain]: 'controlScheme.inputSettings.inputPipesPresetLogarithmicGain',
        [InputPipesPreset.OnOffToggle]: 'controlScheme.inputSettings.inputPipesPresetOnOffToggle',
        [InputPipesPreset.Pulse1Hz]: 'controlScheme.inputSettings.inputPipesPresetPulse1Hz',
        [InputPipesPreset.Pulse2Hz]: 'controlScheme.inputSettings.inputPipesPresetPulse2Hz',
        [InputPipesPreset.Pulse5Hz]: 'controlScheme.inputSettings.inputPipesPresetPulse5Hz',
    };

    public transform(
        value: InputPipesPreset
    ): string {
        return this.keyMap[value];
    }
}
