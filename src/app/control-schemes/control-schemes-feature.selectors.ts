import { createSelector } from '@ngrx/store';
import {
    ATTACHED_IO_MODES_SELECTORS,
    ATTACHED_IO_PORT_MODE_INFO_SELECTORS,
    ATTACHED_IO_SELECTORS,
    AttachedIoModel,
    CONTROLLER_CONNECTION_SELECTORS,
    HUBS_SELECTORS
} from '@app/store';
import { HubIoOperationMode } from '@app/shared';

import { getIoPortModes } from './get-hub-io-operation-modes';
import { ioHasMatchingModeForOpMode } from './io-has-matching-mode-for-op-mode';

export type BindingEditAvailableOperationModesModel = {
    [operationMode in HubIoOperationMode]?: {
        hubs: Array<{ id: string; name: string }>;
        hubIos: {
            [hubId in string]: AttachedIoModel[]
        };
    }
};

export const CONTROL_SCHEMES_FEATURE_SELECTORS = {
    selectBindingEditAvailableOperationModes: createSelector(
        ATTACHED_IO_SELECTORS.selectAll,
        ATTACHED_IO_MODES_SELECTORS.selectEntities,
        ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities,
        HUBS_SELECTORS.selectEntities,
        (ios, supportedModes, portModeData, hubs): BindingEditAvailableOperationModesModel => {
            const result: BindingEditAvailableOperationModesModel = {};
            const allOperationModes = Object.values(HubIoOperationMode) as ReadonlyArray<HubIoOperationMode>;
            const ioOperationModesMap = new Map<AttachedIoModel, HubIoOperationMode[]>(
                ios.map((io) => {
                    const portModes = getIoPortModes(io, supportedModes, portModeData);
                    const controllableOpModes = allOperationModes.filter((mode) => ioHasMatchingModeForOpMode(mode, portModes));
                    return [ io, controllableOpModes ];
                })
            );

            [ ...ioOperationModesMap.entries() ].forEach(([ io, operationModes ]) => {
                operationModes.forEach((opMode) => {
                    const hub = hubs[io.hubId];
                    if (!hub) {
                        return;
                    }
                    if (!result[opMode]) {
                        result[opMode] = {
                            hubs: [],
                            hubIos: {}
                        };
                    }
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    const resultRecord = result[opMode]!;
                    if (!resultRecord.hubIos[io.hubId]) {
                        resultRecord.hubs.push({ id: io.hubId, name: hub.name });
                        resultRecord.hubIos[io.hubId] = [];
                    }
                    resultRecord.hubIos[io.hubId].push(io);
                });
            });
            return result;
        }
    ),
    hasControllableIos: () => createSelector(
        CONTROL_SCHEMES_FEATURE_SELECTORS.selectBindingEditAvailableOperationModes,
        (opModes) => {
            return Object.keys(opModes).length > 0;
        }
    ),
    canAddBinding: () => createSelector(
        HUBS_SELECTORS.selectTotal,
        CONTROLLER_CONNECTION_SELECTORS.selectTotal,
        CONTROL_SCHEMES_FEATURE_SELECTORS.hasControllableIos(),
        (hubsTotal: number, connectedControllersTotal: number, hasControllableIos: boolean) => {
            return hubsTotal > 0 && connectedControllersTotal > 0 && hasControllableIos;
        }
    )
} as const;
