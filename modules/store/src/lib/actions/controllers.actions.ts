import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { GamepadSettings, HubControllerSettings, KeyboardSettings } from '@app/controller-profiles';

export const CONTROLLERS_ACTIONS = createActionGroup({
    source: 'Controllers',
    events: {
        waitForConnect: emptyProps(),
        keyboardDiscovered: props<{ profileUid: string; defaultSettings: KeyboardSettings }>(),
        keyboardConnected: props<{ profileUid: string }>(),
        gamepadDiscovered: props<{
            id: string;
            profileUid: string;
            axesCount: number;
            buttonsCount: number;
            triggerButtonsIndices: number[];
            gamepadApiIndex: number;
            gamepadOfTypeIndex: number;
            defaultSettings: GamepadSettings;
        }>(),
        gamepadConnected: props<{ id: string; gamepadApiIndex: number; profileUid: string }>(),
        gamepadDisconnected: props<{ id: string }>(),
        hubDiscovered: props<{ profileUid: string; hubId: string; defaultSettings: HubControllerSettings }>(),
        hubConnected: props<{ hubId: string }>(),
        hubDisconnected: props<{ hubId: string }>(),
        forgetController: props<{ controllerId: string }>()
    }
});
