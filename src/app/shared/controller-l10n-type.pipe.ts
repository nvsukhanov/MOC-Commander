import { Pipe, PipeTransform } from '@angular/core';

import { ControllerType } from '../store';

@Pipe({
    standalone: true,
    name: 'controllerL10nType',
    pure: true
})
export class ControllerL10nTypePipe implements PipeTransform {
    public transform(
        controllerType: ControllerType
    ): string {
        switch (controllerType) {
            case ControllerType.Keyboard:
                return 'controller.keyboardControllerType';
            case ControllerType.Gamepad:
                return 'controller.gamepadControllerType';
        }
    }
}
