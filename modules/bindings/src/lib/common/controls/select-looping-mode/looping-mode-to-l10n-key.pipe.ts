import { Pipe, PipeTransform } from '@angular/core';
import { LoopingMode } from '@app/store';

@Pipe({
    standalone: true,
    name: 'loopingModeToL10nKey',
    pure: true
})
export class LoopingModeToL10nKeyPipe implements PipeTransform {
    private readonly loopingModeToL10nKeyMap: { [k in LoopingMode]: string } = {
        [LoopingMode.None]: 'controlScheme.loopingModeNone',
        [LoopingMode.Cycle]: 'controlScheme.loopingModeCycle',
        [LoopingMode.PingPong]: 'controlScheme.loopingModePingPong'
    };

    public transform(
        value: LoopingMode
    ): string {
        return this.loopingModeToL10nKeyMap[value];
    }
}
