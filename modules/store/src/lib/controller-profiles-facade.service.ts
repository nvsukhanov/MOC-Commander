import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  ControllerType,
  GamepadProfileFactoryService,
  HubProfileFactoryService,
  IControllerProfile,
  KeyboardProfileFactoryService,
  UnknownControllerProfileFactoryService,
} from '@app/controller-profiles';

import { ControllerModel } from './models';
import { CONTROLLER_SELECTORS, HUBS_SELECTORS } from './selectors';

@Injectable()
export class ControllerProfilesFacadeService {
  constructor(
    private readonly store: Store,
    private readonly gamepadProfileFactoryService: GamepadProfileFactoryService,
    private readonly hubProfileFactoryService: HubProfileFactoryService,
    private readonly keyboardProfileFactoryService: KeyboardProfileFactoryService,
    private readonly unknownControllerProfileFactoryService: UnknownControllerProfileFactoryService,
  ) {}

  public getByControllerId(controllerId: string): Observable<IControllerProfile<unknown>> {
    return this.store.select(CONTROLLER_SELECTORS.selectById(controllerId)).pipe(
      map((controllerModel) => {
        if (!controllerModel) {
          return this.unknownControllerProfileFactoryService.fromUid(controllerId);
        }
        return this.getByControllerModel(controllerModel);
      }),
    );
  }

  public getByControllerModel(controllerModel: ControllerModel): IControllerProfile<unknown> {
    switch (controllerModel.controllerType) {
      case ControllerType.Gamepad:
        return this.gamepadProfileFactoryService.getByProfileUid(controllerModel.profileUid);
      case ControllerType.Hub:
        return this.hubProfileFactoryService.getHubProfile(
          controllerModel.hubId,
          this.store.select(HUBS_SELECTORS.selectHubName(controllerModel.hubId)),
        );
      case ControllerType.Keyboard:
        return this.keyboardProfileFactoryService.getByProfileUid(controllerModel.profileUid);
    }
  }
}
