/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AttachedIO, ControlSchemeBinding, HubIoSupportedModes, IState, PortModeInfo } from '../i-state';
import { HUBS_SELECTORS } from './hubs.selectors';
import { GAMEPAD_SELECTORS } from './gamepad.selectors';
import { CONTROL_SCHEME_SELECTORS } from './control-scheme.selectors';
import { HUB_ATTACHED_IO_SELECTORS } from './hub-attached-io.selectors';
import { HUB_IO_CONTROL_METHODS } from '../hub-io-operation-mode';
import { HUB_IO_SUPPORTED_MODES_SELECTORS } from './hub-io-supported-modes.selectors';
import { Dictionary } from '@ngrx/entity';
import { hubAttachedIosIdFn, hubIOSupportedModesIdFn, hubPortModeInfoIdFn } from '../entity-adapters';
import { HUB_PORT_MODE_INFO_SELECTORS } from './hub-port-mode-info.selectors';

const CONTROL_SCHEME_RUNNING_STATE_FEATURE_SELECTOR = createFeatureSelector<IState['controlSchemeRunningState']>('controlSchemeRunningState');

export enum ControlSchemeUnableToRunReason {
    AlreadyRunning = 'AlreadyRunning',
    MissingScheme = 'MissingScheme',
    SomeHubsAreMissing = 'SomeHubsAreMissing',
    SomeControllersAreMissing = 'SomeControllersAreMissing',
    SomeIOsAreMissing = 'SomeIOsAreMissing',
}

export type CanRunSchemeResultPositive = {
    canRun: true;
}

export type CanRunSchemeResultNegative = {
    canRun: false;
    reason: ControlSchemeUnableToRunReason[];
}

export type CanRunSchemeResult = CanRunSchemeResultPositive | CanRunSchemeResultNegative;

export const CONTROL_SCHEME_RUNNING_STATE_SELECTORS = {
    selectRunSchemeId: createSelector(
        CONTROL_SCHEME_RUNNING_STATE_FEATURE_SELECTOR,
        (state) => state.runningSchemeId
    ),
    canRunScheme: (schemeId: string) => createSelector(
        CONTROL_SCHEME_RUNNING_STATE_SELECTORS.selectRunSchemeId,
        HUBS_SELECTORS.selectHubsIds,
        HUB_ATTACHED_IO_SELECTORS.selectIOsEntities,
        HUB_IO_SUPPORTED_MODES_SELECTORS.selectIOSupportedModesEntities,
        HUB_PORT_MODE_INFO_SELECTORS.selectEntities,
        GAMEPAD_SELECTORS.selectAll,
        CONTROL_SCHEME_SELECTORS.selectScheme(schemeId),
        (alreadyRunningSchemeId, hubIds, IOsEntities, IOSupportedModesEntities, portModeInfoEntities, gamepads, scheme): CanRunSchemeResult => {
            if (alreadyRunningSchemeId !== null) {
                return { canRun: false, reason: [ ControlSchemeUnableToRunReason.AlreadyRunning ] };
            }
            if (!scheme) {
                return { canRun: false, reason: [ ControlSchemeUnableToRunReason.MissingScheme ] };
            }

            const cannotRunReasons: ControlSchemeUnableToRunReason[] = [];

            if (!areAllBindingsHasConnectedHubs(scheme.bindings, hubIds as string[])) {
                cannotRunReasons.push(ControlSchemeUnableToRunReason.SomeHubsAreMissing);
            }

            if (!areAllBindingHasConnectedControllers(scheme.bindings, gamepads.map((g) => g.gamepadIndex))) {
                cannotRunReasons.push(ControlSchemeUnableToRunReason.SomeControllersAreMissing);
            }

            if (!areAllBindingsHasConnectedIOs(scheme.bindings, IOsEntities, IOSupportedModesEntities, portModeInfoEntities)) {
                cannotRunReasons.push(ControlSchemeUnableToRunReason.SomeIOsAreMissing);
            }

            if (cannotRunReasons.length === 0) {
                return {
                    canRun: true
                };
            }
            return {
                canRun: false,
                reason: cannotRunReasons
            };
        }
    )
} as const;

function areAllBindingsHasConnectedHubs(bindings: ControlSchemeBinding[], hubIds: string[]): boolean {
    return bindings.every((binding) => hubIds.includes(binding.output.hubId));
}

// TODO: should verify against some gamepad unique hash
function areAllBindingHasConnectedControllers(bindings: ControlSchemeBinding[], connectedGamepadIds: number[]): boolean {
    return bindings.every((binding) => connectedGamepadIds.includes(binding.input.gamepadId));
}

function areAllBindingsHasConnectedIOs(
    bindings: ControlSchemeBinding[],
    IOs: Dictionary<AttachedIO>,
    hubIoSupportedModesDictionary: Dictionary<HubIoSupportedModes>,
    hubPortModeInfoDictionary: Dictionary<PortModeInfo>
): boolean {
    const attachedIOOutputModeIdsMap = Object.values(IOs).reduce((acc, IO) => {
        if (IO) {
            const attachedIOModesId = hubIOSupportedModesIdFn(IO.hardwareRevision, IO.softwareRevision, IO.ioType);
            const outputModes: number[] = hubIoSupportedModesDictionary[attachedIOModesId]?.portOutputModes ?? [];
            acc.set(IO, outputModes);
        }
        return acc;
    }, new Map<AttachedIO, number[]>);

    return bindings.every((binding) => { // TODO: decrease complexity
        const attachedIOId = hubAttachedIosIdFn(binding.output.hubId, binding.output.portId);
        const attachedIO = IOs[attachedIOId];

        // ensure that the IO is attached
        if (!attachedIO) {
            return false;
        }

        // ensure that the IO supports the operation mode
        const outputModeName = HUB_IO_CONTROL_METHODS[binding.input.gamepadInputMethod][binding.output.operationMode];
        if (outputModeName === undefined) {
            return false;
        }

        const outputModeIds = attachedIOOutputModeIdsMap.get(attachedIO);
        if (!outputModeIds) {
            return false;
        }

        return outputModeIds.some((modeId) => {
            const modeInfoId = hubPortModeInfoIdFn(attachedIO.hardwareRevision, attachedIO.softwareRevision, modeId, attachedIO.ioType);
            const modeInfo = hubPortModeInfoDictionary[modeInfoId];
            return modeInfo?.name === outputModeName;
        });
    });
}
