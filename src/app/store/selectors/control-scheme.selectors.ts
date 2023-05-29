import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ControlSchemeBinding, IState } from '../i-state';
import { CONTROL_SCHEMES_ENTITY_ADAPTER, controllerInputIdFn, hubAttachedIosIdFn, lastExecutedTaskIdFn } from '../entity-adapters';
import { HUB_PORT_TASKS_SELECTORS } from './hub-port-tasks.selectors';
import { HUBS_SELECTORS } from './hubs.selectors';
import { getHubIOOperationModes, HUB_ATTACHED_IO_SELECTORS } from './hub-attached-io.selectors';
import { HUB_IO_SUPPORTED_MODES_SELECTORS } from './hub-io-supported-modes.selectors';
import { HUB_PORT_MODE_INFO_SELECTORS } from './hub-port-mode-info.selectors';
import { CONTROL_SCHEME_RUNNING_STATE_SELECTORS } from './control-scheme-running-state.selectors';
import { PortCommandTask } from '../../common';
import { ROUTER_SELECTORS } from './router.selectors';
import { IOType } from '@nvsukhanov/rxpoweredup';
import { CONTROLLER_SELECTORS } from './controllers.selectors';
import { CONTROLLER_INPUT_SELECTORS } from './controller-input.selectors';

const CONTROL_SCHEME_FEATURE_SELECTOR = createFeatureSelector<IState['controlSchemes']>('controlSchemes');

const CONTROL_SCHEME_ENTITY_SELECTORS = CONTROL_SCHEMES_ENTITY_ADAPTER.getSelectors();

const CONTROL_SCHEME_SELECT_ENTITIES = createSelector(
    CONTROL_SCHEME_FEATURE_SELECTOR,
    CONTROL_SCHEME_ENTITY_SELECTORS.selectEntities
);

const CONTROL_SCHEME_SELECT_ALL = createSelector(
    CONTROL_SCHEME_FEATURE_SELECTOR,
    CONTROL_SCHEME_ENTITY_SELECTORS.selectAll
);

export type SchemeValidationResult = {
    schemeMissing: boolean;
    anotherSchemeIsRunning: boolean;
    controllerIsMissing: boolean;
    hubMissing: boolean;
    ioMissing: boolean;
    ioCapabilitiesMismatch: boolean;
}

export type IOBindingValidationResults = {
    bindingId: string;
    controllerIsMissing: boolean;
    hubMissing: boolean;
    ioMissing: boolean;
    ioCapabilitiesMismatch: boolean;
};

export type ControlSchemeViewIOData = {
    schemeId: string,
    binding: ControlSchemeBinding,
    ioType?: IOType,
    latestExecutedTask: PortCommandTask | undefined,
    validationData: IOBindingValidationResults
};

export const CONTROL_SCHEME_SELECTORS = {
    selectAll: CONTROL_SCHEME_SELECT_ALL,
    selectEntities: createSelector(CONTROL_SCHEME_FEATURE_SELECTOR, CONTROL_SCHEME_ENTITY_SELECTORS.selectEntities),
    selectSchemesList: createSelector(
        CONTROL_SCHEME_SELECT_ALL,
        CONTROL_SCHEME_RUNNING_STATE_SELECTORS.selectRunningSchemeId,
        (
            schemes,
            runningSchemeId
        ) => {
            return schemes.map((scheme) => ({
                ...scheme,
                isRunning: scheme.id === runningSchemeId
            }));
        }
    ),
    selectSchemesCount: createSelector(CONTROL_SCHEME_FEATURE_SELECTOR, CONTROL_SCHEME_ENTITY_SELECTORS.selectTotal),
    selectScheme: (id: string) => createSelector(CONTROL_SCHEME_SELECT_ENTITIES, (state) => state[id]),
    selectSchemeBindingInputValue: (
        schemeId: string,
        binding: ControlSchemeBinding
    ) => createSelector(
        CONTROL_SCHEME_SELECTORS.selectScheme(schemeId),
        CONTROLLER_INPUT_SELECTORS.selectEntities,
        (scheme, inputEntities) => {
            if (!scheme || !inputEntities) {
                return 0;
            }
            const input = inputEntities[controllerInputIdFn(binding.input)];
            return input ? input.value : 0;
        }
    ),
    validateSchemeIOBindings: (schemeId: string) => createSelector(
        CONTROL_SCHEME_SELECTORS.selectScheme(schemeId),
        HUB_PORT_TASKS_SELECTORS.selectLastExecutedTasksEntities,
        HUBS_SELECTORS.selectHubsIds,
        HUB_ATTACHED_IO_SELECTORS.selectIOsEntities,
        HUB_IO_SUPPORTED_MODES_SELECTORS.selectIOSupportedModesEntities,
        HUB_PORT_MODE_INFO_SELECTORS.selectEntities,
        CONTROLLER_SELECTORS.selectEntities,
        (
            scheme,
            tasks,
            hubIds,
            iosEntities,
            ioSupportedModesEntities,
            portModeInfoEntities,
            controllerEntities,
        ): IOBindingValidationResults[] => {
            if (scheme === undefined) {
                return [] as IOBindingValidationResults[];
            }
            const hubIdsSet = new Set([ ...hubIds ]);

            return scheme.bindings.map((binding) => {
                const controller = controllerEntities[binding.input.controllerId];
                const bindingValidationResult: IOBindingValidationResults = {
                    bindingId: binding.id,
                    controllerIsMissing: !controller,
                    hubMissing: !hubIdsSet.has(binding.output.hubId),
                    ioMissing: true,
                    ioCapabilitiesMismatch: true
                };

                if (!bindingValidationResult.hubMissing) {
                    const io = iosEntities[hubAttachedIosIdFn(binding.output)];
                    if (io) {
                        bindingValidationResult.ioMissing = false;
                        const ioOperationModes = getHubIOOperationModes(
                            io,
                            ioSupportedModesEntities,
                            portModeInfoEntities,
                            binding.input.inputType
                        );
                        bindingValidationResult.ioCapabilitiesMismatch = !ioOperationModes.includes(binding.output.operationMode);
                    }
                }

                return bindingValidationResult;
            });
        }
    ),
    validateScheme: (schemeId: string) => createSelector(
        CONTROL_SCHEME_RUNNING_STATE_SELECTORS.selectRunningSchemeId,
        CONTROL_SCHEME_SELECTORS.selectScheme(schemeId),
        CONTROL_SCHEME_SELECTORS.validateSchemeIOBindings(schemeId),
        (
            alreadyRunningSchemeId,
            scheme,
            ioValidationResults
        ): SchemeValidationResult => {
            let canRunResultNegative: SchemeValidationResult = {
                schemeMissing: false,
                anotherSchemeIsRunning: false,
                controllerIsMissing: false,
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

            canRunResultNegative = ioValidationResults.reduce((
                acc,
                cur
            ) => {
                acc.controllerIsMissing = acc.controllerIsMissing || cur.controllerIsMissing;
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
        (
            validationResult,
            runningSchemeId
        ): boolean => {
            return !Object.values(validationResult).some((v) => v) && runningSchemeId === null;
        }
    ),
    selectSchemeIOData: (schemeId: string) => createSelector(
        CONTROL_SCHEME_SELECTORS.selectScheme(schemeId),
        CONTROL_SCHEME_SELECTORS.validateSchemeIOBindings(schemeId),
        HUB_PORT_TASKS_SELECTORS.selectLastExecutedTasksEntities,
        CONTROL_SCHEME_RUNNING_STATE_SELECTORS.selectRunningSchemeId,
        HUB_ATTACHED_IO_SELECTORS.selectIOsEntities,
        (
            scheme,
            validationResult,
            tasks,
            runningSchemeId,
            attachedIOs
        ): ControlSchemeViewIOData[] => {
            if (scheme === undefined) {
                return [];
            }
            const validationMap = new Map(validationResult.map((r) => [ r.bindingId, r ]));

            return scheme.bindings.map((binding) => {
                const ioType = attachedIOs[hubAttachedIosIdFn(binding.output)]?.ioType;
                const task = runningSchemeId === schemeId
                             ? tasks[lastExecutedTaskIdFn(binding.output)]
                             : undefined;
                return {
                    schemeId: schemeId,
                    ioType,
                    binding: binding,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    validationData: validationMap.get(binding.id)!,
                    latestExecutedTask: task,
                } satisfies ControlSchemeViewIOData;
            });
        }
    ),
    isSchemeRunning: (schemeId: string) => createSelector(
        CONTROL_SCHEME_RUNNING_STATE_SELECTORS.selectRunningSchemeId,
        (runningSchemeId) => runningSchemeId === schemeId
    ),
    isCurrentControlSchemeRunning: createSelector(
        CONTROL_SCHEME_RUNNING_STATE_SELECTORS.selectRunningSchemeId,
        ROUTER_SELECTORS.selectRouteParam('id'),
        (
            runningSchemeId,
            schemeId
        ) => runningSchemeId !== null && runningSchemeId === schemeId
    )
} as const;
