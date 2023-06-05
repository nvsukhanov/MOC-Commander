import { Pipe, PipeTransform } from '@angular/core';
import { MotorServoEndState } from '@nvsukhanov/rxpoweredup';
import { composeL10nKey, L10nScopes } from './l10n-scopes';

@Pipe({
    name: 'appMotorServoEndStateL10nKey',
    standalone: true
})
export class MotorServoEndStateL10nKeyPipe implements PipeTransform {
    private mapping: { [s in MotorServoEndState]: string } = {
        [MotorServoEndState.float]: composeL10nKey(L10nScopes.motorServoEndState, 'float'),
        [MotorServoEndState.hold]: composeL10nKey(L10nScopes.motorServoEndState, 'hold'),
        [MotorServoEndState.brake]: composeL10nKey(L10nScopes.motorServoEndState, 'brake')
    };

    public transform(
        endState: MotorServoEndState
    ): string {
        return this.mapping[endState];
    }
}
