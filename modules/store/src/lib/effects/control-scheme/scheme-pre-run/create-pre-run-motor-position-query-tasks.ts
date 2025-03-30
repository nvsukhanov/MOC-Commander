import { Observable, first, of, switchMap, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { PortModeName, ValueTransformers } from 'rxpoweredup';

import { ControlSchemeModel } from '../../../models';
import { HubStorageService } from '../../../hub-storage.service';
import { attachedIosIdFn } from '../../../reducers';
import { ATTACHED_IO_PROPS_ACTIONS } from '../../../actions';
import { ATTACHED_IO_PORT_MODE_INFO_SELECTORS } from '../../../selectors';

export function createPreRunMotorPositionQueryTasks(
  scheme: ControlSchemeModel,
  hubStorage: HubStorageService,
  store: Store,
): Array<Observable<unknown>> {
  const uniqueIosMap = new Map<string, { hubId: string; portId: number }>();
  scheme.bindings.forEach((binding) => {
    uniqueIosMap.set(attachedIosIdFn(binding), { hubId: binding.hubId, portId: binding.portId });
  });
  const uniqueIos = Array.from(uniqueIosMap.values());

  return uniqueIos.map(({ hubId, portId }) => {
    return store
      .select(
        ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectHubPortInputModeForPortModeName({
          hubId,
          portId,
          portModeName: PortModeName.position,
        }),
      )
      .pipe(
        first(),
        switchMap((portModeData) => {
          if (portModeData === null) {
            return of(null);
          }
          return hubStorage.get(hubId).ports.getPortValue(portId, portModeData.modeId, ValueTransformers.position);
        }),
        tap((position) => {
          if (position !== null) {
            store.dispatch(ATTACHED_IO_PROPS_ACTIONS.startupMotorPositionReceived({ hubId, portId, position }));
          }
        }),
        first(),
      );
  });
}
