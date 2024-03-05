import { Injectable } from '@angular/core';
import { Observable, combineLatestWith, switchMap } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { ControlSchemeInput, ControllerProfilesFacadeService } from '@app/store';
import { ControllerInputType } from '@app/controller-profiles';
import { PortIdToPortNameService } from '@app/shared-ui';

import { ControllerInputNameService } from './controller-input-name.service';

@Injectable()
// TODO: remove inheritance
export class DirectionAwareControllerInputNameService extends ControllerInputNameService {
    constructor(
        translocoService: TranslocoService,
        controllerProfilesFacadeService: ControllerProfilesFacadeService,
        portIdToPortNameService: PortIdToPortNameService,
    ) {
        super(translocoService, controllerProfilesFacadeService, portIdToPortNameService);
    }

    public override getFullControllerInputNameData(
        data: ControlSchemeInput,
    ): Observable<string> {
        const profile$ = this.controllerProfilesFacadeService.getByControllerId(data.controllerId);
        const l10nKey = data.inputType === ControllerInputType.Axis
                        ? 'controlScheme.fullControllerInputNameWithDirection'
                        : 'controlScheme.fullControllerInputName';

        const controllerName$ = profile$.pipe(switchMap((profile) => profile.name$));
        const buttonName$ = this.getButtonName$(profile$, data);
        return controllerName$.pipe(
            combineLatestWith(buttonName$),
            switchMap(([ controllerName, inputName ]) =>
                this.translocoService.selectTranslate(l10nKey, { controllerName, inputName, inputDirection: data.inputDirection })
            )
        );
    }
}
