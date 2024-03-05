import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeBinding, ControlSchemeBindingInputs, ControlSchemeInput, PortCommandTask, StepperInputAction } from '@app/store';

import { IBindingL10n } from '../i-binding-l10n';
import { DirectionAwareControllerInputNameService } from '../common';

@Injectable()
export class StepperL10nService implements IBindingL10n<ControlSchemeBindingType.Stepper> {
    public readonly bindingTypeL10nKey = 'controlScheme.stepperBinding.operationMode';

    constructor(
        private readonly translocoService: TranslocoService,
        private readonly directionAwareControllerNameProvider: DirectionAwareControllerInputNameService
    ) {
    }

    public buildTaskSummary(
        task: PortCommandTask<ControlSchemeBindingType.Stepper>
    ): Observable<string> {
        if (task.payload.action === StepperInputAction.Cw) {
            return this.translocoService.selectTranslate('controlScheme.stepperBinding.taskSummaryCw', task.payload);
        } else {
            return this.translocoService.selectTranslate('controlScheme.stepperBinding.taskSummaryCcw', task.payload);
        }
    }

    public getBindingInputName(
        actionType: keyof ControlSchemeBindingInputs<ControlSchemeBindingType.Stepper>,
        binding: ControlSchemeBinding & { bindingType: ControlSchemeBindingType.Stepper }
    ): Observable<string> {
        switch (actionType) {
            case StepperInputAction.Cw:
                return this.translocoService.selectTranslate('controlScheme.stepperBinding.inputActionCw', binding);
            case StepperInputAction.Ccw:
                return this.translocoService.selectTranslate('controlScheme.stepperBinding.inputActionCcw', binding);
        }
    }

    public getBasicInputName(
        actionType: keyof ControlSchemeBindingInputs<ControlSchemeBindingType.Stepper>
    ): Observable<string> {
        switch (actionType) {
            case StepperInputAction.Cw:
                return this.translocoService.selectTranslate('controlScheme.stepperBinding.basicInputActionCw');
            case StepperInputAction.Ccw:
                return this.translocoService.selectTranslate('controlScheme.stepperBinding.basicInputActionCcw');
        }
    }

    public getControllerInputName(
        actionType: keyof ControlSchemeBindingInputs<ControlSchemeBindingType.Stepper>,
        inputConfig: ControlSchemeInput
    ): Observable<string> {
        switch (actionType) {
            case StepperInputAction.Cw:
            case StepperInputAction.Ccw:
                return this.directionAwareControllerNameProvider.getFullControllerInputNameData(inputConfig);
        }
    }
}
