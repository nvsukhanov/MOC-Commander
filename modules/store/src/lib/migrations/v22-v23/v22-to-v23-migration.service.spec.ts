import { anything, instance, mock, when } from 'ts-mockito';
import {
  ControllerType,
  GamepadProfile,
  GamepadProfileFactoryService,
  GamepadSettings,
} from '@app/controller-profiles';
import { DeepPartial } from '@app/shared-misc';

import { AppStoreVersion } from '../../app-store-version';
import { ensureStorePropsNotChanged } from '../ensure-props-not-changed';
import { V22ToV23MigrationService } from './v22-to-v23-migration.service';
import { V21ToV22MigrationService } from '../v21-v22';
import { V21_STORE_SAMPLE } from '../v21';
import { V23Store } from '../v23-v24';
import { V22Store, V23GamepadSettings } from './v22-store';

describe('v22 to v23 migration', () => {
  let v22Store: DeepPartial<V22Store>;
  let profileFactoryServiceMock: GamepadProfileFactoryService;
  let gamepadProfileMock: GamepadProfile;
  let buttonConfigs: GamepadSettings['buttonConfigs'];
  let subject: V22ToV23MigrationService;

  beforeEach(() => {
    profileFactoryServiceMock = mock(GamepadProfileFactoryService);
    gamepadProfileMock = mock(GamepadProfile);
    when(profileFactoryServiceMock.getByProfileUid(anything())).thenReturn(instance(gamepadProfileMock));
    buttonConfigs = { 0: 'new button settings' } as unknown as GamepadSettings['buttonConfigs'];
    when(gamepadProfileMock.getDefaultSettings()).thenReturn({
      controllerType: ControllerType.Gamepad,
      buttonConfigs,
      axisConfigs: {},
    });

    const v22Migration = new V21ToV22MigrationService();
    v22Store = v22Migration.migrate(V21_STORE_SAMPLE);
    subject = new V22ToV23MigrationService(instance(profileFactoryServiceMock));
  });

  it('should migrate controller settings', () => {
    const result = subject.migrate(v22Store);
    V21_STORE_SAMPLE.controllerSettings?.ids?.forEach((id) => {
      const originalSettings = V21_STORE_SAMPLE.controllerSettings?.entities?.[id];
      if (originalSettings?.controllerType === ControllerType.Gamepad) {
        const mutatedAxisConfigs: V23GamepadSettings['axisConfigs'] = {};
        Object.entries(originalSettings.axisConfigs).forEach(([key, value]) => {
          mutatedAxisConfigs[key] = {
            ...value,
            ignoreInput: false,
            trim: 0,
            activationThreshold: 0,
            negativeValueCanActivate: false,
          };
        });
        expect(result.controllerSettings?.entities?.[id]).toEqual({
          ...originalSettings,
          axisConfigs: mutatedAxisConfigs,
          buttonConfigs,
        });
      } else {
        expect(result.controllerSettings?.entities?.[id]).toEqual(originalSettings);
      }
    });

    ensureStorePropsNotChanged<keyof V23Store>(v22Store, result, ['controllerSettings', 'storeVersion']);
  });

  it('should set store version', () => {
    const result = subject.migrate(v22Store);
    expect(result.storeVersion).toEqual(AppStoreVersion.v23);
    ensureStorePropsNotChanged<keyof V23Store>(v22Store, result, ['controllerSettings', 'storeVersion']);
  });
});
