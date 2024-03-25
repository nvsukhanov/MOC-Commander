import { Pipe, PipeTransform } from '@angular/core';
import { HubType } from 'rxpoweredup';

@Pipe({
    standalone: true,
    name: 'hubTypeToL10nKey',
    pure: true
})
export class HubTypeToL10nKeyPipe implements PipeTransform {
    private readonly hubTypeToL10nKeyMap: Readonly<{ [type in HubType]: string }> = {
        [HubType.BoostHub]: 'hubTypes.boost',
        [HubType.WeDoHub]: 'hubTypes.weDo',
        [HubType.DuploTrain]: 'hubTypes.duploTrain',
        [HubType.TwoPortHub]: 'hubTypes.twoPortHub',
        [HubType.TwoPortHandset]: 'hubTypes.twoPortHandset',
        [HubType.FourPortHub]: 'hubTypes.fourPortHub',
        [HubType.Unknown]: 'hubTypes.unknown'
    };

    public transform(
        hubType: HubType
    ): string {
        return this.hubTypeToL10nKeyMap[hubType];
    }
}
