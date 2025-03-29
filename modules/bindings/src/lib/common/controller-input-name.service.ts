import { Injectable } from '@angular/core';
import { Observable, combineLatestWith, switchMap } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';
import { ButtonGroupButtonId } from 'rxpoweredup';
import { ControlSchemeInputConfig, ControllerProfilesFacadeService } from '@app/store';
import { ControllerInputType, IControllerProfile } from '@app/controller-profiles';
import { PortIdToPortNameService } from '@app/shared-components';

@Injectable()
export class ControllerInputNameService {
  constructor(
    private readonly translocoService: TranslocoService,
    private readonly controllerProfilesFacadeService: ControllerProfilesFacadeService,
    private readonly portIdToPortNameService: PortIdToPortNameService,
  ) {}

  public getFullControllerInputNameData(data: ControlSchemeInputConfig): Observable<string> {
    const profile$ = this.controllerProfilesFacadeService.getByControllerId(data.controllerId);
    const l10nKey =
      data.inputType === ControllerInputType.Axis
        ? 'controlScheme.fullControllerInputNameWithDirection'
        : 'controlScheme.fullControllerInputName';

    const controllerName$ = profile$.pipe(switchMap((profile) => profile.name$));
    const buttonName$ = this.getButtonName$(profile$, data);
    return controllerName$.pipe(
      combineLatestWith(buttonName$),
      switchMap(([controllerName, inputName]) =>
        this.translocoService.selectTranslate(l10nKey, {
          controllerName,
          inputName,
          inputDirection: data.inputDirection,
        }),
      ),
    );
  }

  private getButtonName$(
    profile$: Observable<IControllerProfile<unknown>>,
    inputData: Pick<ControlSchemeInputConfig, 'inputId' | 'buttonId' | 'portId' | 'inputType'>,
  ): Observable<string> {
    switch (inputData.inputType) {
      case ControllerInputType.Axis:
        return profile$.pipe(switchMap((p) => p.getAxisName$(inputData.inputId)));
      case ControllerInputType.Button:
      case ControllerInputType.Trigger:
        return profile$.pipe(switchMap((p) => p.getButtonName$(inputData.inputId)));
      case ControllerInputType.ButtonGroup:
        if (inputData.buttonId !== undefined) {
          return profile$.pipe(
            switchMap((p) => p.getButtonName$(inputData.buttonId as ButtonGroupButtonId)),
            switchMap((inputName) =>
              this.translocoService.selectTranslate('controlScheme.controllerInputNameWithPort', {
                inputName,
                portId:
                  inputData.portId === undefined
                    ? inputData.portId
                    : this.portIdToPortNameService.mapPortId(inputData.portId),
              }),
            ),
          );
        }

        return this.translocoService.selectTranslate('controllerProfiles.hub.unknownButton');
    }
  }
}
