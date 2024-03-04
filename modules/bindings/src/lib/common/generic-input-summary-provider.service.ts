import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { ControlSchemeInputAction } from '@app/store';

// TODO: remove this service and use binding-specific services
@Injectable()
export class GenericInputSummaryProviderService {
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
        [ControlSchemeInputAction.Brake]: 'controlScheme.setSpeedBinding.brakeInput',
    };

    constructor(
        private readonly transloco: TranslocoService
    ) {
    }

    public provideInputSummary(
        inputAction: ControlSchemeInputAction
    ): Observable<string> {
        return this.transloco.selectTranslate(this.inputActionsToL10nKeys[inputAction]);
    }
}
