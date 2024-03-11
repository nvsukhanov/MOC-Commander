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
        [InputPipesPreset.OnOffToggle]: 'controlScheme.inputSettings.inputPipesPresetOnOffToggle'
    };

    public transform(
        value: InputPipesPreset
    ): string {
        return this.keyMap[value];
    }
}
