import { Injectable } from '@angular/core';
import { Observable, combineLatestWith, map, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { TranslocoService } from '@ngneat/transloco';
import { ButtonGroupButtonId } from 'rxpoweredup';
import { CONTROLLER_CONNECTION_SELECTORS, CONTROLLER_SELECTORS, ControlSchemeInput, ControllerProfileFactoryService } from '@app/store';
import { ControllerInputType, ControllerSettings, IControllerProfile } from '@app/shared';

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
            map((controller) => {
                if (controller) {
                    return this.profileFactory.getByProfileUid(controller.profileUid);
                }
                return this.profileFactory.getUnknownControllerProfile(data.controllerId);
            })
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
