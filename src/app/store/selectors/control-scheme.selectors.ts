import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ControlSchemeBinding, GamepadInputMethod, IState } from '../i-state';
import { CONTROL_SCHEMES_ENTITY_ADAPTER } from '../entity-adapters';
import { GAMEPAD_AXES_STATE_SELECTORS } from './gamepad-axes-state.selectors';
import { GAMEPAD_BUTTONS_STATE_SELECTORS } from './gamepad-buttons-state.selectors';

const CONTROL_SCHEME_FEATURE_SELECTOR = createFeatureSelector<IState['controlSchemes']>('controlSchemes');

const CONTROL_SCHEME_ENTITY_SELECTORS = CONTROL_SCHEMES_ENTITY_ADAPTER.getSelectors();

const CONTROL_SCHEME_SELECT_ENTITIES = createSelector(
    CONTROL_SCHEME_FEATURE_SELECTOR,
    CONTROL_SCHEME_ENTITY_SELECTORS.selectEntities
);

export const CONTROL_SCHEME_SELECTORS = {
    selectAll: createSelector(CONTROL_SCHEME_FEATURE_SELECTOR, CONTROL_SCHEME_ENTITY_SELECTORS.selectAll),
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
    )
} as const;
