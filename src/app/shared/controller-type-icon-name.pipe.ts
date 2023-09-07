import { Pipe, PipeTransform } from '@angular/core';

import { ControllerType } from './controller-profiles';

@Pipe({
    standalone: true,
    name: 'controllerTypeIconName',
    pure: true
})
export class ControllerTypeIconNamePipe implements PipeTransform {
    private readonly iconNamesMap: { [k in ControllerType]: string } = {
        [ControllerType.Hub]: 'memory',
        [ControllerType.Gamepad]: 'gamepad',
        [ControllerType.Keyboard]: 'keyboard'
    };

    public transform(
        value: ControllerType
    ): string {
        return this.iconNamesMap[value];
    }
}
