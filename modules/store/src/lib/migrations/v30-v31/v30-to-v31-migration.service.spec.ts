import { anything, instance, mock, when } from 'ts-mockito';
import { ControllerType, GamepadProfile, GamepadProfileFactoryService, GamepadSettings } from '@app/controller-profiles';
import { ControlSchemeBindingType, DeepPartial, WidgetType } from '@app/shared-misc';

import { AppStoreVersion } from '../../app-store-version';
import { InputPipeType } from '../../models';
import { V21ToV22MigrationService } from '../v21-v22';
import { V21_STORE_SAMPLE } from '../v21';
import { V23ToV24MigrationService } from '../v23-v24';
import { V24ToV25MigrationService } from '../v24-v25';
import { V25ToV26MigrationService } from '../v25-v26';
import { V27ToV28MigrationService } from '../v27-v28';
import { V30ToV31MigrationService } from './v30-to-v31-migration.service';
import { V28ToV29MigrationService } from '../v28-v29';
import { ensureStorePropsNotChanged } from '../ensure-props-not-changed';
import { V22ToV23MigrationService } from '../v22-v23';
import { V26ToV27MigrationService } from '../v26-v27';
import { V29ToV30MigrationService } from '../v29-v30';
import { V31Store } from '../v31-v32';
import { OLD_TITLE_WIDGET_TYPE, OldInputGain, V30Store } from './v30-store';

describe('v30 to v31 migration', () => {
    let v30Store: DeepPartial<V30Store>;
    let v31Store: DeepPartial<V31Store>;

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
        const v30Tov31Migration = new V30ToV31MigrationService();
        const v22Store = v21To22Migration.migrate(V21_STORE_SAMPLE);
        const v23Store = v22To23Migration.migrate(v22Store);
        const v24Store = v23Tov24Migration.migrate(v23Store);
        const v25Store = v24Tov25Migration.migrate(v24Store);
        const v26Store = v25Tov26Migration.migrate(v25Store);
        const v27Store = v26Tov27Migration.migrate(v26Store);
        const v28Store = v27Tov28Migration.migrate(v27Store);
        const v29Store = v28Tov29Migration.migrate(v28Store);
        v30Store = v29Tov30Migration.migrate(v29Store);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        v30Store.controlSchemes!.entities!['Speed control test']!.widgets = [
            {
                widgetType: OLD_TITLE_WIDGET_TYPE,
                id: 1,
                title: 'Tilt',
                hubId: '90:84:2b:4f:93:20',
                portId: 99,
                modeId: 0,
                valueChangeThreshold: 5,
                width: 2,
                height: 2,
                invertRoll: false,
                invertPitch: true,
                invertYaw: false
            },
            {
                widgetType: 0,
                id: 2,
                title: 'Voltage',
                hubId: '90:84:2b:4f:93:20',
                portId: 60,
                modeId: 0,
                valueChangeThreshold: 0.05,
                width: 1,
                height: 1
            }
        ];
        v31Store = v30Tov31Migration.migrate(v30Store);
    });

    it('should migrate widgets', () => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const widgets = v31Store.controlSchemes!.entities!['Speed control test']!.widgets;
        expect(widgets).toEqual([
            {
                widgetType: WidgetType.Pitch,
                id: 1,
                title: 'Pitch',
                hubId: '90:84:2b:4f:93:20',
                portId: 99,
                modeId: 0,
                valueChangeThreshold: 5,
                width: 1,
                height: 1,
                invert: true
            }, {
                widgetType: WidgetType.Roll,
                id: 2,
                title: 'Roll',
                hubId: '90:84:2b:4f:93:20',
                portId: 99,
                modeId: 0,
                valueChangeThreshold: 5,
                width: 1,
                height: 1,
                invert: false
            }, {
                widgetType: WidgetType.Yaw,
                id: 3,
                title: 'Yaw',
                hubId: '90:84:2b:4f:93:20',
                portId: 99,
                modeId: 0,
                valueChangeThreshold: 5,
                width: 1,
                height: 1,
                invert: false
            }, {
                widgetType: 0,
                id: 4,
                title: 'Voltage',
                hubId: '90:84:2b:4f:93:20',
                portId: 60,
                modeId: 0,
                valueChangeThreshold: 0.05,
                width: 1,
                height: 1
            }
        ]);
    });

    it('should migrate input gain to input pipes', () => {
        const controlSchemes = v31Store.controlSchemes;
        if (!controlSchemes?.entities) {
            return;
        }
        Object.entries(controlSchemes.entities).forEach(([controlSchemeId, controlScheme]) => {
            if (!controlScheme) {
                return;
            }
            controlScheme.bindings.forEach((binding, bindingIndex) => {
                Object.entries(binding.inputs).forEach(([inputAction, inputConfig]) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                   expect((inputConfig as any)['gain']).toBeUndefined();
                   if ([ControlSchemeBindingType.Servo, ControlSchemeBindingType.Speed].includes(binding.bindingType)) {
                       // eslint-disable-next-line @typescript-eslint/no-explicit-any,@stylistic/max-len
                       const originalGain = (v30Store.controlSchemes?.entities?.[controlSchemeId]?.bindings[bindingIndex]?.['inputs'] as any)[inputAction]?.gain as OldInputGain;
                       switch (originalGain) {
                           case OldInputGain.Exponential:
                               expect(inputConfig.inputPipes).toEqual([ { type: InputPipeType.ExponentialGain } ]);
                               break;
                            case OldInputGain.Logarithmic:
                                expect(inputConfig.inputPipes).toEqual([ { type: InputPipeType.LogarithmicGain } ]);
                                break;
                            default:
                                expect(inputConfig.inputPipes).toEqual([]);
                                break;
                       }
                   } else {
                       expect(inputConfig.inputPipes.length).toBe(0);
                   }
                });
            });
        });
    });

    it('should update store version', () => {
        expect(v31Store.storeVersion).toEqual(AppStoreVersion.v31);
    });

    it('should other state is not changed', () => {
        ensureStorePropsNotChanged<keyof V31Store>(
            v30Store,
            v31Store,
            [ 'controlSchemes', 'storeVersion' ]
        );
    });
});
