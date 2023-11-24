import { createEffect } from '@ngrx/effects';
import { Action, Store, createSelector } from '@ngrx/store';
import { inject } from '@angular/core';
import { NEVER, Observable, from, map, mergeMap, pairwise, startWith, switchMap } from 'rxjs';
import { PortModeName } from 'rxpoweredup';
import { ControllerInputType, ControllerType, MAX_INPUT_VALUE, NULL_INPUT_VALUE } from '@app/shared-misc';

import {
    ATTACHED_IO_MODES_SELECTORS,
    ATTACHED_IO_PORT_MODE_INFO_SELECTORS,
    ATTACHED_IO_SELECTORS,
    CONTROLLER_CONNECTION_SELECTORS,
    CONTROLLER_INPUT_SELECTORS,
    CONTROLLER_SELECTORS,
    CONTROLLER_SETTINGS_SELECTORS
} from '../../../selectors';
import { attachedIoModesIdFn, attachedIoPortModeInfoIdFn, attachedIosIdFn, controllerIdFn } from '../../../reducers';
import { HubStorageService } from '../../../hub-storage.service';
import { CONTROLLER_INPUT_ACTIONS } from '../../../actions';

const BUTTON_PORT_MODE_NAMES = new Set<PortModeName>([
    PortModeName.handsetKeyD,
    PortModeName.handsetKeyA,
    PortModeName.handsetKeyR,
    PortModeName.handsetKeySD,
    PortModeName.handsetRCKey
]);

type ListenablePortModeData = {
    hubId: string;
    portId: number;
    modeId: number;
};

const SELECT_ATTACHED_IOS_BUTTON_GROUPS_SELECTOR = createSelector(
    ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities,
    ATTACHED_IO_MODES_SELECTORS.selectEntities,
    ATTACHED_IO_SELECTORS.selectAll,
    CONTROLLER_SELECTORS.selectEntities,
    CONTROLLER_CONNECTION_SELECTORS.selectAll,
    CONTROLLER_SETTINGS_SELECTORS.selectEntities,
    (attachedIOModeInfos, attachedIOModes, attachedIOs, controllers, controllerConnections, settings): ListenablePortModeData[] => {
        const hubControllerConnections = controllerConnections.filter((c) => c.controllerType === ControllerType.Hub);

        const portModeResult: Map<string, ListenablePortModeData> = new Map();

        for (const hubControllerConnection of hubControllerConnections) {
            const hubController = controllers[hubControllerConnection.controllerId];
            if (!hubController || hubController.controllerType !== ControllerType.Hub) {
                continue;
            }
            const hubControllerSettings = settings[hubControllerConnection.controllerId];
            if (hubControllerSettings?.ignoreInput) {
                continue;
            }
            const hubIos = attachedIOs.filter((io) => io.hubId === hubController.hubId);
            for (const io of hubIos) {
                if (portModeResult.has(attachedIosIdFn(io))) {
                    continue;
                }
                const ioModes = attachedIOModes[attachedIoModesIdFn(io)];
                if (!ioModes) {
                    continue;
                }
                const matchingModeInfo = ioModes.portInputModes.find((modeId) => {
                    const modeInfo = attachedIOModeInfos[attachedIoPortModeInfoIdFn({ ...io, modeId })];
                    if (!modeInfo) {
                        return false;
                    }
                    return modeInfo && BUTTON_PORT_MODE_NAMES.has(modeInfo.name);
                });
                if (matchingModeInfo === undefined) {
                    continue;
                }
                portModeResult.set(attachedIosIdFn(io), {
                    hubId: io.hubId,
                    portId: io.portId,
                    modeId: matchingModeInfo
                });
            }
        }
        return Array.from(portModeResult.values());
    }
);

function readButtonGroups(
    store: Store = inject(Store),
    hubStorage: HubStorageService = inject(HubStorageService)
): Observable<Action> {
    return store.select(SELECT_ATTACHED_IOS_BUTTON_GROUPS_SELECTOR).pipe(
        switchMap((buttonGroups) => from(buttonGroups)),
        mergeMap(({ hubId, portId, modeId }) => {
            return hubStorage.get(hubId).ports.portValueChanges(portId, modeId, 1).pipe(
                startWith([ 0 ]),
                pairwise(),
                map(([ [ prevValue ], [ nextValue ] ]) => {
                    const result: Action[] = [];

                    function composeInputReceivedAction(activeInput: boolean): Action {
                        const value = activeInput ? MAX_INPUT_VALUE : NULL_INPUT_VALUE;
                        const inputId = activeInput ? nextValue : prevValue;
                        return CONTROLLER_INPUT_ACTIONS.inputReceived({
                            nextState: {
                                controllerId: controllerIdFn({ controllerType: ControllerType.Hub, hubId }),
                                inputType: ControllerInputType.ButtonGroup,
                                inputId: inputId.toString(),
                                portId,
                                buttonId: activeInput ? nextValue : prevValue,
                                rawValue: value,
                                value,
                                isActivated: activeInput,
                                timestamp: Date.now(),
                            },
                            prevValue
                        });
                    }

                    if (nextValue === 0 && !!prevValue) {
                        result.push(composeInputReceivedAction(false));
                    } else if (!!nextValue && prevValue === 0) {
                        result.push(composeInputReceivedAction(true));
                    } else if (nextValue !== prevValue) {
                        result.push(composeInputReceivedAction(false));
                        result.push(composeInputReceivedAction(true));
                    }
                    return result;
                }),
                switchMap((actions) => from(actions))
            );
        })
    );
}

export const CAPTURE_HUB_BUTTON_GROUPS_INPUT = createEffect((
    store: Store = inject(Store),
    hubStorage: HubStorageService = inject(HubStorageService)
) => {
    return store.select(CONTROLLER_INPUT_SELECTORS.isCapturing).pipe(
        switchMap((isCapturing) => isCapturing
                                   ? readButtonGroups(store, hubStorage)
                                   : NEVER
        )
    );
}, { functional: true });
