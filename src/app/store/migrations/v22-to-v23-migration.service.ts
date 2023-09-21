import { Injectable } from '@angular/core';
import { ControllerType, DeepPartial, GamepadProfileFactoryService, GamepadSettings } from '@app/shared';

import { AppStoreVersion } from '../app-store-version';
import { IMigration } from './i-migration';
import { V22Store, V23GamepadAxisSettings, V23GamepadSettings } from './v22-store';
import { V23Store } from './v23-store';
import { ControllerSettingsModel } from '../models';

@Injectable()
export class V22ToV23MigrationService implements IMigration<V22Store, V23Store> {
    public readonly fromVersion = AppStoreVersion.v22;

    public readonly toVersion = AppStoreVersion.v23;

    constructor(
        private readonly gamepadProfileFactory: GamepadProfileFactoryService
    ) {
    }

    public migrate(
        prev: DeepPartial<V22Store>
    ): DeepPartial<V23Store> {
        const result: DeepPartial<V23Store> = {
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
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            Object.values(controllersSettingsEntities).forEach((settings) => {
                if (!settings) {
                    return;
                }
                const profileUid = controllerEntities[settings.controllerId]?.profileUid;
                if (!profileUid) {
                    return;
                }
                if (settings.controllerType === ControllerType.Gamepad) {
                    const profile = this.gamepadProfileFactory.getByProfileUid(profileUid);
                    const defaultConfig = profile?.getDefaultSettings();
                    if (!defaultConfig || defaultConfig.controllerType !== ControllerType.Gamepad) {
                        result.controllerSettings!.entities![settings.controllerId] = settings as unknown as ControllerSettingsModel;
                    }
                    const axisConfigs: { [k in string]: V23GamepadAxisSettings } = {};
                    Object.entries(settings.axisConfigs).forEach(([ axisId, axisConfig ]) => {
                        axisConfigs[axisId] = {
                            ...axisConfig,
                            ignoreInput: defaultConfig?.axisConfigs[axisId]?.ignoreInput ?? false,
                            trim: defaultConfig?.axisConfigs[axisId]?.trim ?? 0
                        };
                    });
                    result.controllerSettings!.entities![settings.controllerId] = {
                        ...settings,
                        axisConfigs,
                        buttonConfigs: (defaultConfig as GamepadSettings).buttonConfigs
                    } satisfies V23GamepadSettings;
                } else {
                    result.controllerSettings!.entities![settings.controllerId] = settings as unknown as ControllerSettingsModel;
                }
            });
        }
        return result;
    }
}
