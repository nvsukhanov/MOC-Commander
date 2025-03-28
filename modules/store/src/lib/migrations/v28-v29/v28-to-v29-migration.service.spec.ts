import { anything, instance, mock, when } from 'ts-mockito';
import { ControllerType, GamepadProfile, GamepadProfileFactoryService, GamepadSettings } from '@app/controller-profiles';
import { DeepPartial } from '@app/shared-misc';

import { AppStoreVersion } from '../../app-store-version';
import { V22ToV23MigrationService } from '../v22-v23';
import { V21ToV22MigrationService } from '../v21-v22';
import { V21_STORE_SAMPLE } from '../v21';
import { V23Store, V23ToV24MigrationService } from '../v23-v24';
import { V24ToV25MigrationService } from '../v24-v25';
import { V25ToV26MigrationService } from '../v25-v26';
import { V26ToV27MigrationService } from '../v26-v27';
import { V27ToV28MigrationService } from '../v27-v28';
import { ensureStorePropsNotChanged } from '../ensure-props-not-changed';
import { V28ToV29MigrationService } from './v28-to-v29-migration.service';
import { V29Store } from '../v29-v30';
import { V28Store } from './v28-store';

describe('v28 to v29 migration', () => {
  let prev: DeepPartial<V28Store>;
  let current: DeepPartial<V29Store>;

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
    const v27Tov28Migration = new V27ToV28MigrationService();
    const v28Tov29Migration = new V28ToV29MigrationService();
    const v22Store = v21To22Migration.migrate(V21_STORE_SAMPLE);
    const v23Store = v22To23Migration.migrate(v22Store);
    const v24Store = v23Tov24Migration.migrate(v23Store);
    const v25Store = v24Tov25Migration.migrate(v24Store);
    const v26Store = v25Tov26Migration.migrate(v25Store);
    const v27Store = v26Tov27Migration.migrate(v26Store);
    prev = v27Tov28Migration.migrate(v27Store);
    current = v28Tov29Migration.migrate(prev);
  });

  it('should update store version', () => {
    expect(current.storeVersion).toBe(AppStoreVersion.v29);
  });

  it('should create useLinuxCompat setting and set it to null', () => {
    expect(current.settings?.useLinuxCompat).toBeNull();
  });

  it('should other state is not changed', () => {
    ensureStorePropsNotChanged<keyof V23Store>(prev, current, ['settings', 'storeVersion']);
  });
});
