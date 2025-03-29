import { anything, instance, mock, when } from 'ts-mockito';
import {
  ControllerType,
  GamepadProfile,
  GamepadProfileFactoryService,
  GamepadSettings,
} from '@app/controller-profiles';
import { DeepPartial } from '@app/shared-misc';

import { InputDirection } from '../../models';
import { V21ToV22MigrationService } from '../v21-v22';
import { V21_STORE_SAMPLE } from '../v21';
import { V23Store, V23ToV24MigrationService } from '../v23-v24';
import { V24ToV25MigrationService } from '../v24-v25';
import { V25ToV26MigrationService } from '../v25-v26';
import { V27Store, V28ServoBinding } from './v27-store';
import { V27ToV28MigrationService } from './v27-to-v28-migration.service';
import { V28Store } from '../v28-v29';
import { ensureStorePropsNotChanged } from '../ensure-props-not-changed';
import { V22ToV23MigrationService } from '../v22-v23';
import { V26ToV27MigrationService } from '../v26-v27';
import { OldInputAction } from '../old-input-actions';

describe('v27 to v28 migration', () => {
  let v27Store: DeepPartial<V27Store>;
  let v28Store: DeepPartial<V28Store>;

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
    const v22Store = v21To22Migration.migrate(V21_STORE_SAMPLE);
    const v23Store = v22To23Migration.migrate(v22Store);
    const v24Store = v23Tov24Migration.migrate(v23Store);
    const v25Store = v24Tov25Migration.migrate(v24Store);
    const v26Store = v25Tov26Migration.migrate(v25Store);
    v27Store = v26Tov27Migration.migrate(v26Store);
    v28Store = v27Tov28Migration.migrate(v27Store);
  });

  it('should update servo gamepad input settings', () => {
    const servoBindings = v28Store.controlSchemes?.entities?.['Servo']?.bindings as V28ServoBinding[];
    expect(servoBindings[0].inputs[OldInputAction.ServoCw]).toEqual({
      controllerId: 'gamepad-xbox360/0',
      inputId: '0',
      inputType: 1,
      gain: 1,
      inputDirection: InputDirection.Positive,
    } satisfies V28ServoBinding['inputs'][OldInputAction.ServoCw]);
    expect(servoBindings[0].inputs[OldInputAction.ServoCcw]).toEqual({
      controllerId: 'gamepad-xbox360/0',
      inputId: '0',
      inputType: 1,
      gain: 1,
      inputDirection: InputDirection.Negative,
    } satisfies V28ServoBinding['inputs'][OldInputAction.ServoCw]);
  });

  it('should update servo keyboard input settings', () => {
    const servoBindings = v28Store.controlSchemes?.entities?.['Servo']?.bindings as V28ServoBinding[];
    expect(servoBindings[1].inputs[OldInputAction.ServoCw]).toEqual({
      controllerId: 'keyboard',
      inputId: 'a',
      inputType: 0,
      gain: 2,
      inputDirection: InputDirection.Positive,
    } satisfies V28ServoBinding['inputs'][OldInputAction.ServoCw]);
  });

  it('should other state is not changed', () => {
    ensureStorePropsNotChanged<keyof V23Store>(v27Store, v28Store, ['controlSchemes', 'storeVersion']);
  });
});
