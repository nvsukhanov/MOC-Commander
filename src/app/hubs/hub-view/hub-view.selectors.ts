import { createSelector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';

import {
    ATTACHED_IO_MODES_SELECTORS,
    ATTACHED_IO_PORT_MODE_INFO_SELECTORS,
    ATTACHED_IO_SELECTORS,
    AttachedIoModel,
    AttachedIoModesModel,
    AttachedIoPortModeInfoModel,
    attachedIoModesIdFn,
    attachedIoPortModeInfoIdFn
} from '../../store';

function combineFullIoInfo(
    ios: AttachedIoModel[],
    supportedModesEntities: Dictionary<AttachedIoModesModel>,
    portModeDataEntities: Dictionary<AttachedIoPortModeInfoModel>
): HubIoViewModel[] {
    return ios.map((io) => {
        const supportedModesEntityId = attachedIoModesIdFn(io);
        const supportedModes: AttachedIoModesModel | undefined = supportedModesEntities[supportedModesEntityId];
        const portInputModeIds = supportedModes?.portInputModes ?? [];
        const portOutputModeIds = supportedModes?.portOutputModes ?? [];
        const portInputModes = portInputModeIds.map((modeId) => {
            const modeEntityId = attachedIoPortModeInfoIdFn({ ...io, modeId });
            return portModeDataEntities[modeEntityId];
        }).filter((mode) => !!mode) as AttachedIoPortModeInfoModel[];
        const portOutputModes = portOutputModeIds.map((modeId) => {
            const modeEntityId = attachedIoPortModeInfoIdFn({ ...io, modeId });
            return portModeDataEntities[modeEntityId];
        }).filter((mode) => !!mode) as AttachedIoPortModeInfoModel[];

        return {
            ...io,
            portInputModes,
            portOutputModes,
            synchronizable: supportedModes?.synchronizable ?? false,
        };
    });
}

export type HubIoViewModel = {
    portInputModes: AttachedIoPortModeInfoModel[];
    portOutputModes: AttachedIoPortModeInfoModel[];
    synchronizable: boolean;
} & AttachedIoModel;

export const HUB_VIEW_SELECTORS = {
    selectFullIosInfoForHub: (hubId: string) => createSelector(
        ATTACHED_IO_SELECTORS.selectHubIos(hubId),
        ATTACHED_IO_MODES_SELECTORS.selectEntities,
        ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities,
        (ios, supportedModesEntities, portModeDataEntities): HubIoViewModel[] => {
            return combineFullIoInfo(ios, supportedModesEntities, portModeDataEntities);
        }
    ),
} as const;
