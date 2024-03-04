import { EntityState } from '@ngrx/entity';
import { ControllerType } from '@app/controller-profiles';
import { ExtractEntitiesType, Override } from '@app/shared-misc';

import { AppStoreVersion } from '../../app-store-version';
import { V23Store } from '../v23-v24/v23-store';

export type V23ControllerSettings = ExtractEntitiesType<V23Store['controllerSettings']>;
export type V23KeyboardSettings = Extract<V23ControllerSettings, { controllerType: ControllerType.Keyboard }>;
export type V23HubSettings = Extract<V23ControllerSettings, { controllerType: ControllerType.Hub }>;
export type V23GamepadSettings = Extract<V23ControllerSettings, { controllerType: ControllerType.Gamepad }>;
export type V23GamepadAxisSettings = V23GamepadSettings['axisConfigs'][string];
export type V23GamepadButtonSettings = V23GamepadSettings['buttonConfigs'][string];

export type V22ControllerSettings = EntityState<V23KeyboardSettings | V23HubSettings | {
    controllerId: string;
    ignoreInput: boolean;
    controllerType: ControllerType.Gamepad;
    axisConfigs: { [k in string]: Omit<V23GamepadAxisSettings, 'ignoreInput' | 'trim' | 'activationThreshold' | 'negativeValueCanActivate'> };
}>;

export type V22Store = Override<V23Store, {
    controllerSettings: V22ControllerSettings;
    storeVersion: AppStoreVersion.v22;
}>;
