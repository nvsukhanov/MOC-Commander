import { anything, instance, mock, when } from 'ts-mockito';
import { ControllerType, GamepadProfile, GamepadProfileFactoryService, GamepadSettings } from '@app/controller-profiles';
import { DeepPartial } from '@app/shared-misc';

import { V22ToV23MigrationService } from '../v22-v23';
import { V21ToV22MigrationService } from '../v21-v22';
import { V21_STORE_SAMPLE } from '../v21';
import { V23ToV24MigrationService } from './v23-to-v24-migration.service';
import { V24Store } from '../v24-v25/v24-store';
import { V23Store, V24ServoBinding } from './v23-store';

describe('V23ToV24MigrationService', () => {
  let v23Store: DeepPartial<V23Store>;
  let v24Store: DeepPartial<V24Store>;

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
    const v22Store = v21To22Migration.migrate(V21_STORE_SAMPLE);
    v23Store = v22To23Migration.migrate(v22Store);
    v24Store = v23Tov24Migration.migrate(v23Store);
  });

  it('should migrate servo bindings', () => {
    expect((v24Store.controlSchemes?.entities?.['Servo']?.bindings[0] as V24ServoBinding).calibrateOnStart).toBe(false);
  });
});
