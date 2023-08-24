import { Pipe, PipeTransform } from '@angular/core';

import { ControlSchemeBindingType } from './control-scheme-binding-type';

@Pipe({
    name: 'bindingTypeToL10nKey',
    pure: true,
    standalone: true
})
export class BindingTypeToL10nKeyPipe implements PipeTransform {
    private readonly mapping: { [k in ControlSchemeBindingType]: string } = {
        [ControlSchemeBindingType.SetSpeed]: 'controlScheme.setSpeedBinding.operationMode',
        [ControlSchemeBindingType.Servo]: 'controlScheme.servoBinding.operationMode',
        [ControlSchemeBindingType.SetAngle]: 'controlScheme.setAngleBinding.operationMode',
        [ControlSchemeBindingType.Stepper]: 'controlScheme.stepperBinding.operationMode',
        [ControlSchemeBindingType.SpeedShift]: 'controlScheme.speedShiftBinding.operationMode',
        [ControlSchemeBindingType.AngleShift]: 'controlScheme.angleShiftBinding.operationMode',
    };

    public transform(
        bindingType: ControlSchemeBindingType
    ): string {
        return this.mapping[bindingType];
    }
}
