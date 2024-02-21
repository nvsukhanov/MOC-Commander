import { Injectable } from '@angular/core';
import { Observable, combineLatestWith, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { TranslocoService } from '@ngneat/transloco';
import { CONTROLLER_CONNECTION_SELECTORS, ControlSchemeInput, ControllerProfilesFacadeService } from '@app/store';
import { FullControllerInputNameData } from '@app/shared-control-schemes';
import { ControllerInputType } from '@app/controller-profiles';

import { ControllerInputNameService } from './controller-input-name.service';

@Injectable()
// TODO: remove inheritance
export class DirectionAwareControllerInputNameService extends ControllerInputNameService {
    constructor(
        store: Store,
        translocoService: TranslocoService,
        controllerProfilesFacadeService: ControllerProfilesFacadeService
    ) {
        super(store, translocoService, controllerProfilesFacadeService);
    }

    public override getFullControllerInputNameData(
        data: ControlSchemeInput,
    ): FullControllerInputNameData {
        const profile$ = this.controllerProfilesFacadeService.getByControllerId(data.controllerId);
        const l10nKey = data.inputType === ControllerInputType.Axis
                        ? 'controlScheme.fullControllerInputNameWithDirection'
                        : 'controlScheme.fullControllerInputName';

        const controllerName$ = profile$.pipe(switchMap((profile) => profile.name$));
        const buttonName$ = this.getButtonName$(profile$, data);
        const nameResult$: Observable<string> = controllerName$.pipe(
            combineLatestWith(buttonName$),
            switchMap(([ controllerName, inputName ]) =>
                this.translocoService.selectTranslate(l10nKey, { controllerName, inputName, inputDirection: data.inputDirection })
            )
        );

        return {
            name$: nameResult$,
            isConnected$: this.store.select(CONTROLLER_CONNECTION_SELECTORS.isConnected(data.controllerId))
        };
    }
}
