import { Injectable } from '@angular/core';
import { Observable, filter, switchMap } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ATTACHED_IO_PROPS_SELECTORS, AttachedIoPropsModel, ControlSchemeInputConfig, PortCommandTask, ServoBindingInputAction } from '@app/store';

import { IBindingL10n } from '../i-binding-l10n';
import { ControllerInputNameService } from '../common';

@Injectable()
export class ServoBindingL10nService implements IBindingL10n<ControlSchemeBindingType.Servo> {
    public readonly bindingTypeL10nKey = 'controlScheme.servoBinding.operationMode';

    constructor(
        private readonly controllerInputNameService: ControllerInputNameService,
        private readonly translocoService: TranslocoService,
        private readonly store: Store,
    ) {
    }

    public buildTaskSummary(
        task: PortCommandTask<ControlSchemeBindingType.Servo>
    ): Observable<string> {
        return this.store.select(ATTACHED_IO_PROPS_SELECTORS.selectById(task)).pipe(
            filter((ioProps): ioProps is AttachedIoPropsModel => !!ioProps),
            switchMap((ioProps: AttachedIoPropsModel) => {
                const angle = (ioProps.motorEncoderOffset ?? 0) + task.payload.angle;
                return this.translocoService.selectTranslate('controlScheme.servoBinding.taskSummary', { angle });
            })
        );
    }

    public getBindingInputName(
        actionType: ServoBindingInputAction,
    ): Observable<string> {
        switch (actionType) {
            case ServoBindingInputAction.Cw:
                return this.translocoService.selectTranslate('controlScheme.servoBinding.cwAction');
            case ServoBindingInputAction.Ccw:
                return this.translocoService.selectTranslate('controlScheme.servoBinding.ccwAction');
        }
    }

    public getControllerInputName(
        actionType: ServoBindingInputAction,
        inputConfig: ControlSchemeInputConfig
    ): Observable<string> {
        switch (actionType) {
            case ServoBindingInputAction.Cw:
            case ServoBindingInputAction.Ccw:
                return this.controllerInputNameService.getFullControllerInputNameData(inputConfig);
        }
    }

}
