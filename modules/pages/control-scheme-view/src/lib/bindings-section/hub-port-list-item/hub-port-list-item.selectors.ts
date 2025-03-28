 
import { createSelector } from '@ngrx/store';
import {
    ATTACHED_IO_PORT_MODE_INFO_SELECTORS,
    ATTACHED_IO_SELECTORS,
    CONTROL_SCHEME_SELECTORS,
    HUB_RUNTIME_DATA_SELECTORS,
    PORT_TASKS_SELECTORS,
    isUsingAccelerationProfile,
    isUsingDecelerationProfile
} from '@app/store';
import { ioHasMatchingModeForOpMode } from '@app/shared-control-schemes';

export const HUB_PORT_LIST_ITEM_SELECTORS = {
    selectIoType: ({ hubId, portId }: { hubId: string; portId: number }) => createSelector(
        ATTACHED_IO_SELECTORS.selectIoAtPort({ hubId, portId }),
        (io) => io?.ioType ?? null
    ),
    selectIsIoConnected: ({ hubId, portId }: { hubId: string; portId: number }) => createSelector(
        HUB_RUNTIME_DATA_SELECTORS.selectIsHubConnected(hubId),
        ATTACHED_IO_SELECTORS.selectIoAtPort({ hubId, portId }),
        (isHubConnected, io) => isHubConnected && !!io
    ),
    selectIoBindings: ({ controlSchemeName, hubId, portId }: { controlSchemeName: string; hubId: string; portId: number }) => createSelector(
        CONTROL_SCHEME_SELECTORS.selectScheme(controlSchemeName),
        (scheme) => {
            if (!scheme) {
                return [];
            }
            return scheme.bindings.filter((binding) => binding.hubId === hubId && binding.portId === portId);
        }
    ),
    selectPortAccelerationProfileEnabled: (
        { controlSchemeName, hubId, portId }: { controlSchemeName: string; hubId: string; portId: number }
    ) => createSelector(
        CONTROL_SCHEME_SELECTORS.selectScheme(controlSchemeName),
        (scheme) => {
            if (!scheme) {
                return false;
            }
            return scheme.bindings.some((binding) => binding.hubId === hubId && binding.portId === portId && isUsingAccelerationProfile(binding));
        }
    ),
    selectPortDecelerationProfileEnabled: (
        { controlSchemeName, hubId, portId }: { controlSchemeName: string; hubId: string; portId: number }
    ) => createSelector(
        CONTROL_SCHEME_SELECTORS.selectScheme(controlSchemeName),
        (scheme) => {
            if (!scheme) {
                return false;
            }
            return scheme.bindings.some((binding) => binding.hubId === hubId && binding.portId === portId && isUsingDecelerationProfile(binding));
        }
    ),
    selectAccelerationTimeMs: (
        { controlSchemeName, hubId, portId }: { controlSchemeName: string; hubId: string; portId: number }
    ) => createSelector(
        CONTROL_SCHEME_SELECTORS.selectScheme(controlSchemeName),
        (scheme) => {
            if (!scheme) {
                return 0;
            }
            return scheme.portConfigs.find((config) => config.hubId === hubId && config.portId === portId)?.accelerationTimeMs ?? 0;
        }
    ),
    selectDecelerationTimeMs: (
        { controlSchemeName, hubId, portId }: { controlSchemeName: string; hubId: string; portId: number }
    ) => createSelector(
        CONTROL_SCHEME_SELECTORS.selectScheme(controlSchemeName),
        (scheme) => {
            if (!scheme) {
                return 0;
            }
            return scheme.portConfigs.find((config) => config.hubId === hubId && config.portId === portId)?.decelerationTimeMs ?? 0;
        }
    ),
    selectRunningTask: ({ hubId, portId }: { hubId: string; portId: number }) => PORT_TASKS_SELECTORS.selectRunningTask({ hubId, portId }),
    selectLastExecutedTask: ({ hubId, portId }: { hubId: string; portId: number }) => PORT_TASKS_SELECTORS.selectLastExecutedTask({ hubId, portId }),
    selectIoHasRequiredCapabilities: (
        { controlSchemeName, hubId, portId }: { controlSchemeName: string; hubId: string; portId: number }
    ) => createSelector(
        CONTROL_SCHEME_SELECTORS.selectScheme(controlSchemeName),
        ATTACHED_IO_SELECTORS.selectIoAtPort({ hubId, portId }),
        ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectIoOutputPortModeNames({hubId, portId}),
        (scheme, io, outputModes) => {
            if (!scheme || !io) {
                return true;
            }
            return scheme.bindings.filter((binding) => binding.hubId === hubId && binding.portId === portId)
                         .every((binding) => ioHasMatchingModeForOpMode(binding.bindingType, outputModes));
        }
    )
} as const;
