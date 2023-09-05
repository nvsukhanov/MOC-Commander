import { Injectable } from '@angular/core';
import { Observable, combineLatestWith, filter, map, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { TranslocoService } from '@ngneat/transloco';
import { ButtonGroupButtonId } from 'rxpoweredup';
import { CONTROLLER_CONNECTION_SELECTORS, CONTROLLER_SELECTORS, ControlSchemeInput, ControllerModel, ControllerProfileFactoryService } from '@app/store';
import { ControllerInputType } from '@app/shared';

import { ControllerSettings, IControllerProfile } from '../../../controller-profiles';

export type FullControllerInputNameData = {
    readonly name$: Observable<string>;
    readonly isConnected$: Observable<boolean>;
};

@Injectable({ providedIn: 'root' })
export class FullControllerInputNameService {
    constructor(
        private readonly store: Store,
        private readonly translocoService: TranslocoService,
        private readonly profileFactory: ControllerProfileFactoryService
    ) {
    }

    public getFullControllerInputNameData(
        data: Pick<ControlSchemeInput, 'inputId' | 'buttonId' | 'portId' | 'inputType' | 'controllerId'>
    ): FullControllerInputNameData {
        const profile$ = this.store.select(CONTROLLER_SELECTORS.selectById(data.controllerId)).pipe(
            filter((controller): controller is ControllerModel => !!controller),
            map((controller) => this.profileFactory.getByProfileUid(controller.profileUid))
        );

        const controllerName$ = profile$.pipe(switchMap((profile) => profile.name$));
        const buttonName$ = this.getButtonName$(profile$, data);
        const nameResult$: Observable<string> = controllerName$.pipe(
            combineLatestWith(buttonName$),
            switchMap(([ controllerName, inputName ]) =>
                this.translocoService.selectTranslate('controlScheme.fullControllerInputName', { controllerName, inputName })
            )
        );

        return {
            name$: nameResult$,
            isConnected$: this.store.select(CONTROLLER_CONNECTION_SELECTORS.isConnected(data.controllerId))
        };
    }

    private getButtonName$(
        profile$: Observable<IControllerProfile<ControllerSettings | null>>,
        inputData: Pick<ControlSchemeInput, 'inputId' | 'buttonId' | 'portId' | 'inputType'>
    ): Observable<string> {
        switch (inputData.inputType) {
            case ControllerInputType.Axis:
                return profile$.pipe(switchMap((p) => p.getAxisName$(inputData.inputId)));
            case ControllerInputType.Button:
            case ControllerInputType.Trigger:
                return profile$.pipe(switchMap((p) => p.getButtonName$(inputData.inputId)));
            case ControllerInputType.ButtonGroup:
                return inputData.buttonId !== undefined
                       ? profile$.pipe(
                        switchMap((p) => p.getButtonName$(inputData.buttonId as ButtonGroupButtonId)),
                        switchMap((inputName) =>
                            this.translocoService.selectTranslate('controlScheme.controllerInputNameWithPort', { inputName, portId: inputData.portId })
                        )
                    )
                       : this.translocoService.selectTranslate('controllerProfiles.hub.unknownButton');
        }
    }
}
