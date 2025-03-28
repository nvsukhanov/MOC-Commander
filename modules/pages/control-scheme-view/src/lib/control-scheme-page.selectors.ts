import { Dictionary } from '@ngrx/entity';
import { PortModeName } from 'rxpoweredup';
import { createSelector } from '@ngrx/store';
import {
  ATTACHED_IO_MODES_SELECTORS,
  ATTACHED_IO_PORT_MODE_INFO_SELECTORS,
  ATTACHED_IO_SELECTORS,
  AttachedIoModel,
  CONTROLLER_CONNECTION_SELECTORS,
  CONTROL_SCHEME_SELECTORS,
  ControlSchemeModel,
  ControlSchemeRunState,
  ControllerConnectionModel,
  HUB_RUNTIME_DATA_SELECTORS,
  ROUTER_SELECTORS,
  attachedIoModesIdFn,
  attachedIoPortModeInfoIdFn,
  attachedIosIdFn,
} from '@app/store';
import { ioHasMatchingModeForOpMode } from '@app/shared-control-schemes';

import { SchemeRunBlocker } from './issues-section/run-blockers';
import { IControlSchemeRunWidgetBlockersChecker } from './widgets';

const SELECT_CURRENTLY_VIEWED_SCHEME = createSelector(
  ROUTER_SELECTORS.selectCurrentlyViewedSchemeName,
  CONTROL_SCHEME_SELECTORS.selectEntities,
  (schemeName, schemes) => (schemeName === null ? undefined : schemes[schemeName]),
);

const SELECT_IO_MODES = createSelector(
  ATTACHED_IO_SELECTORS.selectAll,
  ATTACHED_IO_MODES_SELECTORS.selectEntities,
  ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities,
  (ios, ioSupportedModesEntities, portModeInfoEntities): { input: Record<string, PortModeName[]>; output: Record<string, PortModeName[]> } => {
    const input: Record<string, PortModeName[]> = {};
    const output: Record<string, PortModeName[]> = {};
    for (const io of ios) {
      const ioId = attachedIosIdFn(io);
      output[ioId] = (ioSupportedModesEntities[attachedIoModesIdFn(io)]?.portOutputModes ?? [])
        .map((modeId) => {
          const portModeInfo = portModeInfoEntities[attachedIoPortModeInfoIdFn({ ...io, modeId })];
          return portModeInfo?.name ?? null;
        })
        .filter((name): name is PortModeName => !!name);
      input[ioId] = (ioSupportedModesEntities[attachedIoModesIdFn(io)]?.portInputModes ?? [])
        .map((modeId) => {
          const portModeInfo = portModeInfoEntities[attachedIoPortModeInfoIdFn({ ...io, modeId })];
          return portModeInfo?.name ?? null;
        })
        .filter((name): name is PortModeName => !!name);
    }
    return { input, output };
  },
);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const SELECT_SCHEME_RUN_BLOCKERS = (widgetChecks: IControlSchemeRunWidgetBlockersChecker) =>
  createSelector(
    SELECT_CURRENTLY_VIEWED_SCHEME,
    CONTROL_SCHEME_SELECTORS.selectRunningState,
    HUB_RUNTIME_DATA_SELECTORS.selectIds,
    SELECT_IO_MODES,
    CONTROLLER_CONNECTION_SELECTORS.selectEntities,
    ATTACHED_IO_SELECTORS.selectEntities,
    (
      scheme: ControlSchemeModel | undefined,
      runningState: ControlSchemeRunState,
      connectedHubIds: string[],
      ioModes: { input: Record<string, PortModeName[]>; output: Record<string, PortModeName[]> },
      controllerConnections: Dictionary<ControllerConnectionModel>,
      attachedIos: Dictionary<AttachedIoModel>,
    ): SchemeRunBlocker[] => {
      if (!scheme) {
        return [SchemeRunBlocker.SchemeDoesNotExist];
      }
      const result = new Set<SchemeRunBlocker>();

      if (runningState !== ControlSchemeRunState.Idle) {
        result.add(SchemeRunBlocker.AlreadyRunning);
      }
      if (!scheme.bindings.length) {
        result.add(SchemeRunBlocker.SchemeBindingsDoesNotExist);
      }

      if (scheme.bindings.some((b) => !connectedHubIds.includes(b.hubId))) {
        result.add(SchemeRunBlocker.SomeHubsAreNotConnected);
      }

      if (scheme.bindings.some((b) => !attachedIos[attachedIosIdFn(b)])) {
        result.add(SchemeRunBlocker.SomeIosAreNotConnected);
      }

      if (
        scheme.bindings
          .filter((b) => !!attachedIos[attachedIosIdFn(b)])
          .some((b) => !ioHasMatchingModeForOpMode(b.bindingType, ioModes.output[attachedIosIdFn(b)] ?? []))
      ) {
        result.add(SchemeRunBlocker.SomeIosHaveNoRequiredCapabilities);
      }

      for (const widgetConfig of scheme.widgets) {
        const blockers = widgetChecks.getBlockers(widgetConfig, attachedIos, ioModes.input, connectedHubIds);
        for (const blocker of blockers) {
          result.add(blocker);
        }
      }

      if (scheme.bindings.some((b) => !Object.values(b.inputs).every((input) => !!controllerConnections[input.controllerId]))) {
        result.add(SchemeRunBlocker.SomeControllersAreNotConnected);
      }
      return [...result];
    },
  );

export const CONTROL_SCHEME_PAGE_SELECTORS = {
  selectCurrentlyViewedScheme: SELECT_CURRENTLY_VIEWED_SCHEME,
  selectIoOutputModes: SELECT_IO_MODES,
  selectSchemeRunBlockers: SELECT_SCHEME_RUN_BLOCKERS,
  canRunViewedScheme: (widgetChecks: IControlSchemeRunWidgetBlockersChecker) =>
    createSelector(SELECT_SCHEME_RUN_BLOCKERS(widgetChecks), (blockers): boolean => {
      return blockers.length === 0;
    }),
  isCurrentControlSchemeRunning: createSelector(
    CONTROL_SCHEME_SELECTORS.selectRunningSchemeName,
    ROUTER_SELECTORS.selectCurrentlyViewedSchemeName,
    (runningSchemeName, routerSchemeName) => runningSchemeName !== null && runningSchemeName === routerSchemeName,
  ),
  canDeleteOrEditWidgets: createSelector(CONTROL_SCHEME_SELECTORS.selectRunningState, (runningState) => runningState === ControlSchemeRunState.Idle),
  canRenameScheme: createSelector(CONTROL_SCHEME_SELECTORS.selectRunningState, (runningState) => runningState === ControlSchemeRunState.Idle),
} as const;
