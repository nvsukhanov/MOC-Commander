import { anything, instance, mock, when } from 'ts-mockito';
import {
  ControllerType,
  GamepadProfile,
  GamepadProfileFactoryService,
  GamepadSettings,
} from '@app/controller-profiles';
import { DeepPartial } from '@app/shared-misc';

import { V22ToV23MigrationService } from '../v22-v23';
import { V21ToV22MigrationService } from '../v21-v22';
import { V21_STORE_SAMPLE } from '../v21';
import { V26Store } from './v26-store';
import { V23ToV24MigrationService } from '../v23-v24';
import { V24ToV25MigrationService } from '../v24-v25';
import { V27Store } from '../v27-v28';
import { V26ToV27MigrationService } from './v26-to-v27-migration.service';
import { V25ToV26MigrationService } from '../v25-v26';

describe('v26 to v27 migration', () => {
  let v26Store: DeepPartial<V26Store>;
  let v27Store: DeepPartial<V27Store>;

  beforeEach(() => {
    const profileFactoryServiceMock = mock(GamepadProfileFactoryService);
    const gamepadProfileMock = mock(GamepadProfile);
    when(profileFactoryServiceMock.getByProfileUid(anything())).thenReturn(instance(gamepadProfileMock));
    const buttonConfigs = { 0: 'new button settings' } as unknown as GamepadSettings['buttonConfigs'];
    when(gamepadProfileMock.getDefaultSettings()).thenReturn({
      controllerType: ControllerType.Gamepad,
      buttonConfigs,
      axisConfigs: {},
    });
    const v21To22Migration = new V21ToV22MigrationService();
    const v22To23Migration = new V22ToV23MigrationService(instance(profileFactoryServiceMock));
    const v23Tov24Migration = new V23ToV24MigrationService();
    const v24Tov25Migration = new V24ToV25MigrationService();
    const v25Tov26Migration = new V25ToV26MigrationService();
    const v26Tov27Migration = new V26ToV27MigrationService();
    const v22Store = v21To22Migration.migrate(V21_STORE_SAMPLE);
    const v23Store = v22To23Migration.migrate(v22Store);
    const v24Store = v23Tov24Migration.migrate(v23Store);
    const v25Store = v24Tov25Migration.migrate(v24Store);
    v26Store = v25Tov26Migration.migrate(v25Store);
    v27Store = v26Tov27Migration.migrate(v26Store);
  });

  it('should remove negativeValueCanActivate from gamepad axis and button settings', () => {
    v27Store.controllerSettings?.ids?.forEach((id) => {
      const controllerSettings = v27Store.controllerSettings?.entities?.[id];
      if (controllerSettings?.controllerType === ControllerType.Gamepad) {
        const axisConfigs = controllerSettings.axisConfigs;
        const buttonConfigs = controllerSettings.buttonConfigs;
        Object.values(axisConfigs).forEach((axisConfig) => {
          expect(axisConfig).not.toHaveProperty('negativeValueCanActivate');
        });
        Object.values(buttonConfigs).forEach((buttonConfig) => {
          expect(buttonConfig).not.toHaveProperty('negativeValueCanActivate');
        });
      }
    });
  });
});
