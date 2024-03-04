import { Pipe, PipeTransform } from '@angular/core';
import { InputGain } from '@app/store';

@Pipe({
    standalone: true,
    name: 'inputGainL10nKey',
    pure: true
})
export class InputGainL10nKeyPipe implements PipeTransform {
    private readonly inputGainL10nKeyMap: { [k in InputGain]: string } = {
        [InputGain.Linear]: 'controlScheme.inputGainLinear',
        [InputGain.Exponential]: 'controlScheme.inputGainExponential',
        [InputGain.Logarithmic]: 'controlScheme.inputGainLogarithmic'
    };

    public transform(
        value: InputGain
    ): string {
        return this.inputGainL10nKeyMap[value];
    }
}
