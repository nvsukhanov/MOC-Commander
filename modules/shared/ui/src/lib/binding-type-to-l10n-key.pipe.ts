import { Pipe, PipeTransform } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';

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
        [ControlSchemeBindingType.TrainControl]: 'controlScheme.trainControlBinding.operationMode',
        [ControlSchemeBindingType.GearboxControl]: 'controlScheme.gearboxControlBinding.operationMode',
    };

    public transform(
        bindingType: ControlSchemeBindingType
    ): string {
        return this.mapping[bindingType];
    }
}
