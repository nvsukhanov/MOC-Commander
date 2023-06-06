import { Pipe, PipeTransform } from '@angular/core';
import { ControllerType } from '../plugins';

@Pipe({
    standalone: true,
    name: 'controllerTypeIcon',
    pure: true
})
export class ControllerTypeIconPipe implements PipeTransform {
    public transform(
        controllerType: ControllerType
    ): string {
        switch (controllerType) {
            case ControllerType.Keyboard:
                return 'keyboard';
            case ControllerType.Gamepad:
                return 'gamepad';
        }
    }
}
