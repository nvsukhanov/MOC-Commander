import { anything, instance, mock, when } from 'ts-mockito';
import {
  ControllerType,
  GamepadProfile,
  GamepadProfileFactoryService,
  GamepadSettings,
} from '@app/controller-profiles';
import { DeepPartial } from '@app/shared-misc';

import { V21ToV22MigrationService } from '../v21-v22';
import { V21_STORE_SAMPLE } from '../v21';
import { V22ToV23MigrationService } from '../v22-v23';
import { V24Store } from './v24-store';
import { V25Store } from '../v25-v26';
import { V24ToV25MigrationService } from './v24-to-v25-migration.service';
import { V23ToV24MigrationService } from '../v23-v24';

describe('V24ToV25MigrationService', () => {
  let v24Store: DeepPartial<V24Store>;
  let v25Store: DeepPartial<V25Store>;

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
    const v22Store = v21To22Migration.migrate(V21_STORE_SAMPLE);
    const v23Store = v22To23Migration.migrate(v22Store);
    v24Store = v23Tov24Migration.migrate(v23Store);
    v25Store = v24Tov25Migration.migrate(v24Store);
  });

  it('should add widgets property', () => {
    expect(v25Store.controlSchemes?.entities?.['Servo']?.widgets).toEqual([]);
  });
});
