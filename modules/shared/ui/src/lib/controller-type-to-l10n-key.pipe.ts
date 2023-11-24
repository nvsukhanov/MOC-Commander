import { Pipe, PipeTransform } from '@angular/core';
import { ControllerType } from '@app/shared-misc';

@Pipe({
    standalone: true,
    name: 'controllerTypeToL10nKey',
    pure: true
})
export class ControllerTypeToL10nKeyPipe implements PipeTransform {
    private readonly l10nKeysMap: { [k in ControllerType]: string } = {
        [ControllerType.Hub]: 'controller.controllerTypeHub',
        [ControllerType.Gamepad]: 'controller.controllerTypeGamepad',
        [ControllerType.Keyboard]: 'controller.controllerTypeKeyboard'
    };

    public transform(
        value: ControllerType
    ): string {
        return this.l10nKeysMap[value];
    }
}
