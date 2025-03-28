import { EntityState, Update, createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { ControlSchemeBinding, ControlSchemeModel, ControlSchemePortConfig, WidgetConfigModel } from '../models';
import { CONTROL_SCHEME_ACTIONS } from '../actions';
import { attachedIosIdFn } from './attached-ios.reducer';

function createDefaultPortConfig({ hubId, portId }: { hubId: string; portId: number }): ControlSchemePortConfig {
  return {
    hubId,
    portId,
    accelerationTimeMs: DEFAULT_ACC_DEC_PROFILE_TIME_MS,
    decelerationTimeMs: DEFAULT_ACC_DEC_PROFILE_TIME_MS,
  };
}

function ensurePortConfigsAreUpToDate(bindings: ControlSchemeBinding[], portConfigs: ControlSchemePortConfig[]): ControlSchemePortConfig[] {
  let result = [...portConfigs];
  const existingPortConfigIds = new Set(result.map((p) => attachedIosIdFn(p)));
  const existingBindingIds = new Set(result.map((b) => attachedIosIdFn(b)));

  const shouldRemovePortConfig = result.some((p) => !existingBindingIds.has(attachedIosIdFn(p)));
  if (shouldRemovePortConfig) {
    result = result.filter((p) => existingPortConfigIds.has(attachedIosIdFn(p)));
  }

  const shouldAddPortConfig = bindings.some((b) => !existingPortConfigIds.has(attachedIosIdFn(b)));
  if (shouldAddPortConfig) {
    result = result.concat(bindings.filter((b) => !existingPortConfigIds.has(attachedIosIdFn(b))).map((b) => createDefaultPortConfig(b)));
  }

  if (shouldRemovePortConfig || shouldAddPortConfig) {
    return result;
  }
  return portConfigs;
}

export const DEFAULT_ACC_DEC_PROFILE_TIME_MS = 100;

export enum ControlSchemeRunState {
  Idle,
  Starting,
  Running,
  Stopping,
}

export interface IControlSchemeState extends EntityState<ControlSchemeModel> {
  runningState: ControlSchemeRunState;
  runningSchemeName: string | null;
}

export const CONTROL_SCHEME_ENTITY_ADAPTER = createEntityAdapter({
  selectId: (model: ControlSchemeModel) => model.name,
});

export const CONTROL_SCHEME_FEATURE = createFeature({
  name: 'controlSchemes',
  reducer: createReducer(
    CONTROL_SCHEME_ENTITY_ADAPTER.getInitialState({
      runningState: ControlSchemeRunState.Idle,
      runningSchemeName: null as string | null,
    }),
    on(CONTROL_SCHEME_ACTIONS.createControlScheme, (state, action): IControlSchemeState => {
      return CONTROL_SCHEME_ENTITY_ADAPTER.addOne(
        {
          name: action.name,
          portConfigs: [],
          bindings: [],
          widgets: [],
        },
        state,
      );
    }),
    on(
      CONTROL_SCHEME_ACTIONS.startScheme,
      (state): IControlSchemeState => ({
        ...state,
        runningState: ControlSchemeRunState.Starting,
      }),
    ),
    on(
      CONTROL_SCHEME_ACTIONS.schemeStarted,
      (state, { name }): IControlSchemeState => ({
        ...state,
        runningState: ControlSchemeRunState.Running,
        runningSchemeName: name,
      }),
    ),
    on(CONTROL_SCHEME_ACTIONS.stopScheme, (state): IControlSchemeState => {
      if (state.runningState === ControlSchemeRunState.Running || state.runningState === ControlSchemeRunState.Starting) {
        return {
          ...state,
          runningState: ControlSchemeRunState.Stopping,
        };
      }
      return state;
    }),
    on(
      CONTROL_SCHEME_ACTIONS.schemeStopped,
      CONTROL_SCHEME_ACTIONS.schemeStartFailed,
      (state): IControlSchemeState => ({
        ...state,
        runningSchemeName: null,
        runningState: ControlSchemeRunState.Idle,
      }),
    ),
    on(CONTROL_SCHEME_ACTIONS.deleteControlScheme, (state, { name }): IControlSchemeState => CONTROL_SCHEME_ENTITY_ADAPTER.removeOne(name, state)),
    on(CONTROL_SCHEME_ACTIONS.saveBinding, (state, { binding, schemeName }): IControlSchemeState => {
      const scheme = state.entities[schemeName];
      if (!scheme) {
        return state;
      }
      const bindingIndex = scheme.bindings.findIndex((b) => b.id === binding.id);
      if (bindingIndex === -1) {
        return state;
      }

      const newBindings = [...scheme.bindings];
      newBindings[bindingIndex] = binding;
      const update: Update<ControlSchemeModel> = {
        id: schemeName,
        changes: {
          bindings: newBindings,
        },
      };
      const updatedPortConfigs = ensurePortConfigsAreUpToDate(newBindings, scheme.portConfigs);
      if (updatedPortConfigs !== scheme.portConfigs) {
        update.changes.portConfigs = updatedPortConfigs;
      }
      return CONTROL_SCHEME_ENTITY_ADAPTER.updateOne(update, state);
    }),
    on(CONTROL_SCHEME_ACTIONS.createBinding, (state, { binding, schemeName }): IControlSchemeState => {
      const scheme = state.entities[schemeName];
      if (!scheme) {
        return state;
      }
      const nextBindingId = Math.max(...scheme.bindings.map((b) => b.id), 0) + 1;
      const resultingBinding = {
        ...binding,
        id: nextBindingId,
      };
      const nextBindings = [...scheme.bindings, resultingBinding];
      const update: Update<ControlSchemeModel> = {
        id: schemeName,
        changes: {
          bindings: nextBindings,
        },
      };
      const updatedPortConfigs = ensurePortConfigsAreUpToDate(nextBindings, scheme.portConfigs);
      if (updatedPortConfigs !== scheme.portConfigs) {
        update.changes.portConfigs = updatedPortConfigs;
      }
      return CONTROL_SCHEME_ENTITY_ADAPTER.updateOne(update, state);
    }),
    on(CONTROL_SCHEME_ACTIONS.deleteBinding, (state, { schemeName, bindingId }): IControlSchemeState => {
      const scheme = state.entities[schemeName];
      if (!scheme) {
        return state;
      }
      const update: Update<ControlSchemeModel> = {
        id: schemeName,
        changes: {},
      };
      update.changes.bindings = scheme.bindings.filter((b) => b.id !== bindingId);
      const remainingIoIds = new Set(update.changes.bindings.map((b) => attachedIosIdFn(b)));
      const shouldRemovePortConfig = scheme.portConfigs.some((p) => !remainingIoIds.has(attachedIosIdFn(p)));
      if (shouldRemovePortConfig) {
        update.changes.portConfigs = scheme.portConfigs.filter((p) => remainingIoIds.has(attachedIosIdFn(p)));
      }
      return CONTROL_SCHEME_ENTITY_ADAPTER.updateOne(update, state);
    }),
    on(CONTROL_SCHEME_ACTIONS.updateControlSchemeName, (state, { previousName, name }) => {
      return CONTROL_SCHEME_ENTITY_ADAPTER.updateOne(
        {
          id: previousName,
          changes: {
            name,
          },
        },
        state,
      );
    }),
    on(CONTROL_SCHEME_ACTIONS.savePortConfig, (state, { portConfig, schemeName }): IControlSchemeState => {
      const scheme = state.entities[schemeName];
      if (!scheme) {
        return state;
      }
      const portConfigIndex = scheme.portConfigs.findIndex((p) => p.portId === portConfig.portId && p.hubId === portConfig.hubId);
      if (portConfigIndex === -1) {
        return state;
      }
      const newPortConfigs = [...scheme.portConfigs];
      newPortConfigs[portConfigIndex] = portConfig;
      return CONTROL_SCHEME_ENTITY_ADAPTER.updateOne(
        {
          id: schemeName,
          changes: {
            portConfigs: newPortConfigs,
          },
        },
        state,
      );
    }),
    on(CONTROL_SCHEME_ACTIONS.importControlScheme, (state, { scheme }): IControlSchemeState => {
      return CONTROL_SCHEME_ENTITY_ADAPTER.addOne(scheme, state);
    }),
    on(CONTROL_SCHEME_ACTIONS.addWidget, (state, { schemeName, widgetConfig }): IControlSchemeState => {
      const scheme = state.entities[schemeName];
      if (!scheme) {
        return state;
      }
      const id = Math.max(...scheme.widgets.map((w) => w.id), 0) + 1;
      const nextWidgets = [...scheme.widgets, { ...widgetConfig, id }] as WidgetConfigModel[];
      return CONTROL_SCHEME_ENTITY_ADAPTER.updateOne(
        {
          id: schemeName,
          changes: {
            widgets: nextWidgets,
          },
        },
        state,
      );
    }),
    on(CONTROL_SCHEME_ACTIONS.deleteWidget, (state, { schemeName, widgetId }): IControlSchemeState => {
      const scheme = state.entities[schemeName];
      if (!scheme) {
        return state;
      }
      return CONTROL_SCHEME_ENTITY_ADAPTER.updateOne(
        {
          id: schemeName,
          changes: {
            widgets: scheme.widgets.filter((w) => w.id !== widgetId),
          },
        },
        state,
      );
    }),
    on(CONTROL_SCHEME_ACTIONS.updateWidget, (state, { schemeName, widgetConfig }): IControlSchemeState => {
      const scheme = state.entities[schemeName];
      if (!scheme) {
        return state;
      }
      const widgetIndex = scheme.widgets.findIndex((w) => w.id === widgetConfig.id);
      if (widgetIndex === -1) {
        return state;
      }
      const nextWidgets = [...scheme.widgets];
      nextWidgets[widgetIndex] = widgetConfig;
      return CONTROL_SCHEME_ENTITY_ADAPTER.updateOne(
        {
          id: schemeName,
          changes: {
            widgets: nextWidgets,
          },
        },
        state,
      );
    }),
    on(CONTROL_SCHEME_ACTIONS.reorderWidgets, (state, { schemeName, widgets }): IControlSchemeState => {
      const scheme = state.entities[schemeName];
      if (!scheme) {
        return state;
      }
      return CONTROL_SCHEME_ENTITY_ADAPTER.updateOne(
        {
          id: schemeName,
          changes: {
            widgets,
          },
        },
        state,
      );
    }),
  ),
});
