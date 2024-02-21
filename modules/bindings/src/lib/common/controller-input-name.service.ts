import { Injectable } from '@angular/core';
import { Observable, combineLatestWith, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { TranslocoService } from '@ngneat/transloco';
import { ButtonGroupButtonId } from 'rxpoweredup';
import { ControllerInputType, IControllerProfile } from '@app/controller-profiles';
import { CONTROLLER_CONNECTION_SELECTORS, ControlSchemeInput, ControllerProfilesFacadeService } from '@app/store';
import { FullControllerInputNameData } from '@app/shared-control-schemes';

@Injectable()
export class ControllerInputNameService {
    constructor(
        protected readonly store: Store,
        protected readonly translocoService: TranslocoService,
        protected readonly controllerProfilesFacadeService: ControllerProfilesFacadeService
    ) {
    }

    public getFullControllerInputNameData(
        data: ControlSchemeInput,
    ): FullControllerInputNameData {
        const profile$ = this.controllerProfilesFacadeService.getByControllerId(data.controllerId);

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

    protected getButtonName$(
        profile$: Observable<IControllerProfile<unknown>>,
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
