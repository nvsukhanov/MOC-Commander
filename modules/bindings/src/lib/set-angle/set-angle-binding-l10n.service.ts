import { Observable, filter, switchMap } from 'rxjs';
import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import {
    ATTACHED_IO_PROPS_SELECTORS,
    AttachedIoPropsModel,
    ControlSchemeBindingInputs,
    ControlSchemeInput,
    ControlSchemeSetAngleBinding,
    PortCommandTask,
    SetAngleBindingInputAction
} from '@app/store';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { IBindingL10n } from '../i-binding-l10n';
import { ControllerInputNameService } from '../common';

@Injectable()
export class SetAngleBindingL10nService implements IBindingL10n<ControlSchemeBindingType.SetAngle> {
    public readonly bindingTypeL10nKey = 'controlScheme.setAngleBinding.operationMode';

    constructor(
        private readonly translocoService: TranslocoService,
        private readonly store: Store,
        private readonly transloco: TranslocoService,
        private readonly controllerNameProvider: ControllerInputNameService,
    ) {
    }

    public buildTaskSummary(
        task: PortCommandTask<ControlSchemeBindingType.SetAngle>
    ): Observable<string> {
        return this.store.select(ATTACHED_IO_PROPS_SELECTORS.selectById(task)).pipe(
            filter((ioProps): ioProps is AttachedIoPropsModel => !!ioProps),
            switchMap((ioProps: AttachedIoPropsModel) => {
                const angle = (ioProps.motorEncoderOffset ?? 0) + task.payload.angle;
                return this.translocoService.selectTranslate('controlScheme.setAngleBinding.taskSummary', { angle });
            })
        );
    }

    public getBindingInputName(
        actionType: keyof ControlSchemeBindingInputs<ControlSchemeBindingType.SetAngle>,
        binding: ControlSchemeSetAngleBinding
    ): Observable<string> {
        return this.transloco.selectTranslate('controlScheme.setAngleBinding.inputAction', binding);
    }

    public getBasicInputName(
        actionType: keyof ControlSchemeBindingInputs<ControlSchemeBindingType.SetAngle>
    ): Observable<string> {
        switch (actionType) {
            case SetAngleBindingInputAction.SetAngle:
                return this.transloco.selectTranslate('controlScheme.setAngleBinding.basicInputAction');
        }
    }

    public getControllerInputName(
        actionType: keyof ControlSchemeBindingInputs<ControlSchemeBindingType.SetAngle>,
        inputConfig: ControlSchemeInput
    ): Observable<string> {
        switch (actionType) {
            case SetAngleBindingInputAction.SetAngle:
                return this.controllerNameProvider.getFullControllerInputNameData(inputConfig);
        }
    }
}
