import { CAPTURE_GAMEPAD_INPUT } from './capture-gamepad-input.effect';
import { CAPTURE_KEYBOARD_INPUT } from './capture-keyboard-input.effect';
import { CAPTURE_HUB_GREEN_BUTTON_INPUT } from './capture-hub-green-button-input.effect';
import { CAPTURE_HUB_BUTTON_GROUPS_INPUT } from './capture-hub-button-groups-input.effect';

export const CONTROLLER_CAPTURE_INPUT_EFFECTS = {
  gamepadInput: CAPTURE_GAMEPAD_INPUT,
  keyboardInput: CAPTURE_KEYBOARD_INPUT,
  hubGreenButtonInput: CAPTURE_HUB_GREEN_BUTTON_INPUT,
  hubButtonGroupsInput: CAPTURE_HUB_BUTTON_GROUPS_INPUT,
} as const;
