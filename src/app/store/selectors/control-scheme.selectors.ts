import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ControlSchemeBinding, GamepadInputMethod, IState } from '../i-state';
import { CONTROL_SCHEMES_ENTITY_ADAPTER, hubAttachedIosIdFn, lastExecutedTaskIdFn } from '../entity-adapters';
import { GAMEPAD_AXES_STATE_SELECTORS } from './gamepad-axes-state.selectors';
import { GAMEPAD_BUTTONS_STATE_SELECTORS } from './gamepad-buttons-state.selectors';
import { HUB_PORT_TASKS_SELECTORS } from './hub-port-tasks.selectors';
import { HUBS_SELECTORS } from './hubs.selectors';
import { getHubIOOperationModes, HUB_ATTACHED_IO_SELECTORS } from './hub-attached-io.selectors';
import { HUB_IO_SUPPORTED_MODES_SELECTORS } from './hub-io-supported-modes.selectors';
import { HUB_PORT_MODE_INFO_SELECTORS } from './hub-port-mode-info.selectors';
import { GAMEPAD_SELECTORS } from './gamepad.selectors';
import { CONTROL_SCHEME_RUNNING_STATE_SELECTORS } from './control-scheme-running-state.selectors';
import { PortCommandSetLinearSpeedTask } from '../../types';

const CONTROL_SCHEME_FEATURE_SELECTOR = createFeatureSelector<IState['controlSchemes']>('controlSchemes');

const CONTROL_SCHEME_ENTITY_SELECTORS = CONTROL_SCHEMES_ENTITY_ADAPTER.getSelectors();

const CONTROL_SCHEME_SELECT_ENTITIES = createSelector(
    CONTROL_SCHEME_FEATURE_SELECTOR,
    CONTROL_SCHEME_ENTITY_SELECTORS.selectEntities
);

export type SchemeValidationResult = {
    schemeMissing: boolean;
    anotherSchemeIsRunning: boolean;
    gamepadMissing: boolean;
    hubMissing: boolean;
    ioMissing: boolean;
    ioCapabilitiesMismatch: boolean;
}

export type IOBindingValidationResults = {
    bindingId: string;
    gamepadMissing: boolean;
    hubMissing: boolean;
    ioMissing: boolean;
    ioCapabilitiesMismatch: boolean;
};

export type ControlSchemeViewIOData = {
    schemeId: string,
    binding: ControlSchemeBinding,
    latestExecutedTask: PortCommandSetLinearSpeedTask | undefined,
    validationData: IOBindingValidationResults
};

export const CONTROL_SCHEME_SELECTORS = {
    selectAll: createSelector(CONTROL_SCHEME_FEATURE_SELECTOR, CONTROL_SCHEME_ENTITY_SELECTORS.selectAll),
    selectEntities: createSelector(CONTROL_SCHEME_FEATURE_SELECTOR, CONTROL_SCHEME_ENTITY_SELECTORS.selectEntities),
    selectScheme: (id: string) => createSelector(CONTROL_SCHEME_SELECT_ENTITIES, (state) => state[id]),
    selectSchemeBinding: (schemeId: string, bindingIndex: number) => createSelector(
        CONTROL_SCHEME_SELECTORS.selectScheme(schemeId),
        (scheme) => scheme?.bindings[bindingIndex]
    ),
    selectSchemeBindingInput: (schemeId: string, bindingIndex: number) => createSelector(
        CONTROL_SCHEME_SELECTORS.selectSchemeBinding(schemeId, bindingIndex),
        (binding) => binding?.input
    ),
    selectSchemeBindingInputValue: (schemeId: string, binding: ControlSchemeBinding) => createSelector(
        GAMEPAD_AXES_STATE_SELECTORS.selectAll,
        GAMEPAD_BUTTONS_STATE_SELECTORS.selectAll,
        (axes, buttons) => {
            const input = binding.input;
            if (input?.gamepadInputMethod === GamepadInputMethod.Axis) {
                const axis = axes.find((a) => a.gamepadIndex === input.gamepadId && a.axisIndex === input.gamepadAxisId);
                return axis?.value ?? 0;
            } else if (input?.gamepadInputMethod === GamepadInputMethod.Button) {
                const button = buttons.find((b) => b.gamepadIndex === input.gamepadId && b.buttonIndex === input.gamepadButtonId);
                return button?.value ?? 0;
            } else {
                return 0;
            }
        }
    ),
    validateSchemeIOBindings: (schemeId: string) => createSelector(
        CONTROL_SCHEME_SELECTORS.selectScheme(schemeId),
        HUB_PORT_TASKS_SELECTORS.selectLastExecutedTasksEntities,
        HUBS_SELECTORS.selectHubsIds,
        HUB_ATTACHED_IO_SELECTORS.selectIOsEntities,
        HUB_IO_SUPPORTED_MODES_SELECTORS.selectIOSupportedModesEntities,
        HUB_PORT_MODE_INFO_SELECTORS.selectEntities,
        GAMEPAD_SELECTORS.selectAll,
        (scheme, tasks, hubIds, iosEntities, ioSupportedModesEntities, portModeInfoEntities, gamepads): IOBindingValidationResults[] => {
            if (scheme === undefined) {
                return [] as IOBindingValidationResults[];
            }
            const hubIdsSet = new Set([ ...hubIds ]);
            const gamepadIds = new Set([ ...gamepads.map((g) => g.gamepadIndex) ]);

            const result: IOBindingValidationResults[] = scheme.bindings.map((binding) => {
                const bindingValidationResult: IOBindingValidationResults = {
                    bindingId: binding.id,
                    gamepadMissing: !gamepadIds.has(binding.input.gamepadId),
                    hubMissing: !hubIdsSet.has(binding.output.hubId),
                    ioMissing: true,
                    ioCapabilitiesMismatch: true
                };

                if (!bindingValidationResult.hubMissing) {
                    const io = iosEntities[hubAttachedIosIdFn(binding.output.hubId, binding.output.portId)];
                    if (io) {
                        bindingValidationResult.ioMissing = false;
                        const ioOperationModes = getHubIOOperationModes(
                            io,
                            ioSupportedModesEntities,
                            portModeInfoEntities,
                            binding.input.gamepadInputMethod
                        );
                        bindingValidationResult.ioCapabilitiesMismatch = !ioOperationModes.includes(binding.output.operationMode);
                    }
                }

                return bindingValidationResult;
            });
            return result;
        }
    ),
    validateScheme: (schemeId: string) => createSelector(
        CONTROL_SCHEME_RUNNING_STATE_SELECTORS.selectRunningSchemeId,
        CONTROL_SCHEME_SELECTORS.selectScheme(schemeId),
        CONTROL_SCHEME_SELECTORS.validateSchemeIOBindings(schemeId),
        (alreadyRunningSchemeId, scheme, ioValidationResults): SchemeValidationResult => {
            let canRunResultNegative: SchemeValidationResult = {
                schemeMissing: false,
                anotherSchemeIsRunning: false,
                gamepadMissing: false,
                hubMissing: false,
                ioMissing: false,
                ioCapabilitiesMismatch: false,
            };

            if (alreadyRunningSchemeId !== null && alreadyRunningSchemeId !== schemeId) {
                canRunResultNegative.anotherSchemeIsRunning = true;
            }
            if (!scheme) {
                canRunResultNegative.schemeMissing = false;
            }

            canRunResultNegative = ioValidationResults.reduce((acc, cur) => {
                acc.gamepadMissing = acc.gamepadMissing || cur.gamepadMissing;
                acc.hubMissing = acc.hubMissing || cur.hubMissing;
                acc.ioMissing = acc.ioMissing || cur.ioMissing;
                acc.ioCapabilitiesMismatch = acc.ioCapabilitiesMismatch || cur.ioCapabilitiesMismatch;
                return acc;
            }, canRunResultNegative);

            return canRunResultNegative;
        }
    ),
    canRunScheme: (schemeId: string) => createSelector(
        CONTROL_SCHEME_SELECTORS.validateScheme(schemeId),
        CONTROL_SCHEME_RUNNING_STATE_SELECTORS.selectRunningSchemeId,
        (validationResult, runningSchemeId): boolean => {
            return !Object.values(validationResult).some((v) => v) && runningSchemeId === null;
        }
    ),
    selectSchemeIOData: (schemeId: string) => createSelector(
        CONTROL_SCHEME_SELECTORS.selectScheme(schemeId),
        CONTROL_SCHEME_SELECTORS.validateSchemeIOBindings(schemeId),
        HUB_PORT_TASKS_SELECTORS.selectLastExecutedTasksEntities,
        HUBS_SELECTORS.selectHubsIds,
        (scheme, validationResult, tasks): ControlSchemeViewIOData[] => {
            if (scheme === undefined) {
                return [];
            }
            const validationMap = new Map(validationResult.map((r) => [ r.bindingId, r ]));

            return scheme.bindings.map((binding) => {
                const task = tasks[lastExecutedTaskIdFn(binding.output.hubId, binding.output.portId)];
                return {
                    schemeId: schemeId,
                    binding: binding,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    validationData: validationMap.get(binding.id)!,
                    latestExecutedTask: task,
                } satisfies ControlSchemeViewIOData;
            });
        }
    ),
} as const;
