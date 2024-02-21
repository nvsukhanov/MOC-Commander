import { Injectable } from '@angular/core';
import { ControllerType } from '@app/controller-profiles';
import { DeepPartial } from '@app/shared-misc';

import { AppStoreVersion } from '../app-store-version';
import { IMigration } from './i-migration';
import { ControllerSettingsModel } from '../models';
import { V26Store, V27GamepadAxisSettings, V27GamepadButtonSettings, V27GamepadSettings } from './v26-store';
import { V27Store } from './v27-store';

@Injectable()
export class V26ToV27MigrationService implements IMigration<V26Store, V27Store> {
    public readonly fromVersion = AppStoreVersion.v26;

    public readonly toVersion = AppStoreVersion.v27;

    public migrate(
        prev: DeepPartial<V26Store>
    ): DeepPartial<V27Store> {
        const result: DeepPartial<V27Store> = {
            ...prev,
            controllerSettings: {
                ids: prev.controllerSettings?.ids ?? [],
                entities: {}
            },
            storeVersion: this.toVersion
        };
        if (prev.controllers?.ids && prev.controllers.entities && prev.controllerSettings?.entities) {
            const controllersSettingsEntities = prev.controllerSettings.entities;
            const controllerEntities = prev.controllers.entities;
            Object.values(controllersSettingsEntities).forEach((settings) => {
                if (!settings) {
                    return;
                }
                const profileUid = controllerEntities[settings.controllerId]?.profileUid;
                if (!profileUid) {
                    return;
                }
                if (settings.controllerType === ControllerType.Gamepad) {
                    const axisConfigs: { [k in string]: V27GamepadAxisSettings } = {};
                    const buttonConfigs: { [k in string]: V27GamepadButtonSettings } = {};
                    Object.entries(settings.axisConfigs).forEach(([ axisId, axisConfig ]) => {
                        axisConfigs[axisId] = { ...axisConfig };
                        delete axisConfigs[axisId]['negativeValueCanActivate' as keyof V27GamepadAxisSettings];
                    });
                    Object.entries(settings.buttonConfigs).forEach(([ buttonId, buttonConfig ]) => {
                        buttonConfigs[buttonId] = { ...buttonConfig };
                        delete buttonConfigs[buttonId]['negativeValueCanActivate' as keyof V27GamepadButtonSettings];
                    });
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    result.controllerSettings!.entities![settings.controllerId] = {
                        ...settings,
                        axisConfigs,
                        buttonConfigs
                    } satisfies V27GamepadSettings;
                } else {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    result.controllerSettings!.entities![settings.controllerId] = settings as unknown as ControllerSettingsModel;
                }
            });
        }
        return result;
    }
}
