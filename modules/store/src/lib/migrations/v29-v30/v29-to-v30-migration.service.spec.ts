import { anything, instance, mock, when } from 'ts-mockito';
import { ControllerType, GamepadProfile, GamepadProfileFactoryService, GamepadSettings } from '@app/controller-profiles';
import { DeepPartial } from '@app/shared-misc';

import { AppStoreVersion } from '../../app-store-version';
import { ControlSchemeInputAction, InputDirection } from '../../models';
import { V21ToV22MigrationService } from '../v21-v22';
import { V21_STORE_SAMPLE } from '../v21';
import { V23ToV24MigrationService } from '../v23-v24';
import { V24ToV25MigrationService } from '../v24-v25';
import { V25ToV26MigrationService } from '../v25-v26';
import { V27ToV28MigrationService } from '../v27-v28';
import { V29ToV30MigrationService } from './v29-to-v30-migration.service';
import { V28ToV29MigrationService } from '../v28-v29';
import { ensureStorePropsNotChanged } from '../ensure-props-not-changed';
import { V22ToV23MigrationService } from '../v22-v23';
import { V26ToV27MigrationService } from '../v26-v27';
import { V30Store } from '../v30';
import { V29Store, V30SetSpeedBinding } from './v29-store';

describe('v29 to v30 migration', () => {
    let v29Store: DeepPartial<V29Store>;
    let v30Store: DeepPartial<V30Store>;

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
        const v26Tov27Migration = new V26ToV27MigrationService();
        const v27Tov28Migration = new V27ToV28MigrationService();
        const v28Tov29Migration = new V28ToV29MigrationService();
        const v29Tov30Migration = new V29ToV30MigrationService();
        const v22Store = v21To22Migration.migrate(V21_STORE_SAMPLE);
        const v23Store = v22To23Migration.migrate(v22Store);
        const v24Store = v23Tov24Migration.migrate(v23Store);
        const v25Store = v24Tov25Migration.migrate(v24Store);
        const v26Store = v25Tov26Migration.migrate(v25Store);
        const v27Store = v26Tov27Migration.migrate(v26Store);
        const v28Store = v27Tov28Migration.migrate(v27Store);
        v29Store = v28Tov29Migration.migrate(v28Store);
        v30Store = v29Tov30Migration.migrate(v29Store);
    });

    it('should update setSpeed keyboard input settings', () => {
        const setSpeedBindings = v30Store.controlSchemes?.entities?.['Speed control test']?.bindings as V30SetSpeedBinding[];
        expect(setSpeedBindings[0].inputs[ControlSchemeInputAction.Forwards]).toEqual({
            controllerId: 'keyboard',
            inputId: 'w',
            inputType: 0,
            gain: 0,
            inputDirection: InputDirection.Positive
        } satisfies V30SetSpeedBinding['inputs'][ControlSchemeInputAction.Forwards]);
        expect(setSpeedBindings[0].inputs[ControlSchemeInputAction.Brake]).toEqual({
            controllerId: 'keyboard',
            inputId: 's',
            inputType: 0,
            gain: 0,
            inputDirection: InputDirection.Positive
        } satisfies V30SetSpeedBinding['inputs'][ControlSchemeInputAction.Brake]);
        expect(setSpeedBindings[0].inputs[ControlSchemeInputAction.Backwards]).toBeUndefined();
    });

    it('should update setSpeed gamepad input settings', () => {
        const setSpeedBindings = v30Store.controlSchemes?.entities?.['Speed control test']?.bindings as V30SetSpeedBinding[];
        expect(setSpeedBindings[1].inputs[ControlSchemeInputAction.Forwards]).toEqual({
            controllerId: 'gamepad-xbox360/0',
            inputId: '1',
            inputType: 1,
            gain: 0,
            inputDirection: InputDirection.Positive
        } satisfies V30SetSpeedBinding['inputs'][ControlSchemeInputAction.Forwards]);
        expect(setSpeedBindings[1].inputs[ControlSchemeInputAction.Backwards]).toEqual({
            controllerId: 'gamepad-xbox360/0',
            inputId: '1',
            inputType: 1,
            gain: 0,
            inputDirection: InputDirection.Negative
        } satisfies V30SetSpeedBinding['inputs'][ControlSchemeInputAction.Backwards]);
        expect(setSpeedBindings[1].inputs[ControlSchemeInputAction.Brake]).toEqual({
            controllerId: 'gamepad-xbox360/0',
            inputId: '0',
            inputType: 0,
            gain: 0,
            inputDirection: InputDirection.Positive
        } satisfies V30SetSpeedBinding['inputs'][ControlSchemeInputAction.Brake]);
    });

    it('should update store version', () => {
        expect(v30Store.storeVersion).toEqual(AppStoreVersion.v30);
    });

    it('should other state is not changed', () => {
        ensureStorePropsNotChanged<keyof V30Store>(
            v29Store,
            v30Store,
            [ 'controlSchemes', 'storeVersion' ]
        );
    });
});
