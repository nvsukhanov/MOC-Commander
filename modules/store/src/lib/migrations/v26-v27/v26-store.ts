import { EntityState } from '@ngrx/entity';
import { ExtractEntitiesType, Override } from '@app/shared-misc';
import { ControllerType } from '@app/controller-profiles';

import { AppStoreVersion } from '../../app-store-version';
import { V27Store } from '../v27-v28';

export type V27ControllerSettings = ExtractEntitiesType<V27Store['controllerSettings']>;
export type V27KeyboardSettings = Extract<V27ControllerSettings, { controllerType: ControllerType.Keyboard }>;
export type V27HubSettings = Extract<V27ControllerSettings, { controllerType: ControllerType.Hub }>;
export type V27GamepadSettings = Extract<V27ControllerSettings, { controllerType: ControllerType.Gamepad }>;
export type V27GamepadAxisSettings = V27GamepadSettings['axisConfigs'][string];
export type V27GamepadButtonSettings = V27GamepadSettings['buttonConfigs'][string];

export type V26ControllerSettings = EntityState<V27KeyboardSettings | V27HubSettings | {
    controllerId: string;
    ignoreInput: boolean;
    controllerType: ControllerType.Gamepad;
    axisConfigs: { [k in string]: V27GamepadAxisSettings & { negativeValueCanActivate: boolean } };
    buttonConfigs: { [k in string]: V27GamepadButtonSettings & { negativeValueCanActivate: boolean } };
}>;

export type V26Store = Override<V27Store, {
    controllerSettings: V26ControllerSettings;
    storeVersion: AppStoreVersion.v26;
}>;
