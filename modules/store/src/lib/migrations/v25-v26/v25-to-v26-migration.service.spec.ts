import { anything, instance, mock, when } from 'ts-mockito';
import { ControllerType, GamepadProfile, GamepadProfileFactoryService, GamepadSettings } from '@app/controller-profiles';
import { DeepPartial } from '@app/shared-misc';

import { AppStoreVersion } from '../../app-store-version';
import { V21ToV22MigrationService } from '../v21-v22';
import { V21_STORE_SAMPLE } from '../v21';
import { V22ToV23MigrationService } from '../v22-v23';
import { V23ToV24MigrationService } from '../v23-v24';
import { V24ToV25MigrationService, V25Store } from '../v24-v25';
import { V26Store } from '../v26-v27';
import { V25ToV26MigrationService } from './v25-to-v26-migration.service';
import { InputDirection } from '../../models';
import { V30InputConfig } from '../v30-v31';

describe('V25ToV26MigrationService', () => {
    let v25Store: DeepPartial<V25Store>;
    let v26Store: DeepPartial<V26Store>;

    beforeEach(() => {
        const profileFactoryServiceMock = mock(GamepadProfileFactoryService);
        const gamepadProfileMock = mock(GamepadProfile);
        when(profileFactoryServiceMock.getByProfileUid(anything())).thenReturn(instance(gamepadProfileMock));
        const buttonConfigs = { 0: 'new button settings' } as unknown as GamepadSettings['buttonConfigs'];
        when(gamepadProfileMock.getDefaultSettings()).thenReturn({
            controllerType: ControllerType.Gamepad,
            buttonConfigs,
            axisConfigs: {}
        });
        const v21To22Migration = new V21ToV22MigrationService();
        const v22To23Migration = new V22ToV23MigrationService(instance(profileFactoryServiceMock));
        const v23Tov24Migration = new V23ToV24MigrationService();
        const v24Tov25Migration = new V24ToV25MigrationService();
        const v25Tov26Migration = new V25ToV26MigrationService();
        const v22Store = v21To22Migration.migrate(V21_STORE_SAMPLE);
        const v23Store = v22To23Migration.migrate(v22Store);
        const v24Store = v23Tov24Migration.migrate(v23Store);
        v25Store = v24Tov25Migration.migrate(v24Store);
        v26Store = v25Tov26Migration.migrate(v25Store);
    });

    it('should add inputDirection property', () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const servoInput = v26Store.controlSchemes?.entities?.['Servo']?.bindings[0].inputs['2'] as V30InputConfig;
        expect(servoInput.inputDirection).toEqual(InputDirection.Positive);
        expect(v26Store.storeVersion).toBe(AppStoreVersion.v26);
    });
});
