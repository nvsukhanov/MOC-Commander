import { Pipe, PipeTransform } from '@angular/core';
import { ControlSchemeInputAction } from '@app/store';

// TODO: use binding-specific services in this pipe
@Pipe({
    standalone: true,
    name: 'controlSchemeInputActionToL10nKey',
    pure: true
})
export class ControlSchemeInputActionToL10nKeyPipe implements PipeTransform {
    private readonly inputActionsToL10nKeys: { [k in ControlSchemeInputAction]: string } = {
        [ControlSchemeInputAction.Servo]: 'controlScheme.inputActions.servo',
        [ControlSchemeInputAction.OldSetSpeedBrake]: 'controlScheme.setSpeedBinding.brakeInput',
        [ControlSchemeInputAction.Accelerate]: 'controlScheme.inputActions.accelerate',
        [ControlSchemeInputAction.Step]: 'controlScheme.inputActions.step',
        [ControlSchemeInputAction.SetAngle]: 'controlScheme.inputActions.setAngle',
        [ControlSchemeInputAction.NextLevel]: 'controlScheme.inputActions.nextLevel',
        [ControlSchemeInputAction.PrevLevel]: 'controlScheme.inputActions.prevLevel',
        [ControlSchemeInputAction.Reset]: 'controlScheme.inputActions.reset',
        [ControlSchemeInputAction.ServoCw]: 'controlScheme.servoBinding.cwAction',
        [ControlSchemeInputAction.ServoCcw]: 'controlScheme.servoBinding.ccwAction',
        [ControlSchemeInputAction.Forwards]: 'controlScheme.setSpeedBinding.forwardsInput',
        [ControlSchemeInputAction.Backwards]: 'controlScheme.setSpeedBinding.backwardsInput',
        [ControlSchemeInputAction.Brake]: 'controlScheme.setSpeedBinding.brakeInput'
    };

    public transform(
        inputAction: ControlSchemeInputAction
    ): string {
        return this.inputActionsToL10nKeys[inputAction];
    }
}
