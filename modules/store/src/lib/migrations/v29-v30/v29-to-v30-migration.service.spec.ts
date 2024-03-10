import { anything, instance, mock, when } from 'ts-mockito';
import { MOTOR_LIMITS } from 'rxpoweredup';
import { ControllerType, GamepadProfile, GamepadProfileFactoryService, GamepadSettings } from '@app/controller-profiles';
import { DeepPartial } from '@app/shared-misc';

import { AppStoreVersion } from '../../app-store-version';
import {
    GearboxBindingInputAction,
    InputDirection,
    ServoBindingInputAction,
    SetAngleBindingInputAction,
    SpeedBindingInputAction,
    StepperBindingInputAction,
    TrainBindingInputAction
} from '../../models';
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
import { V30Store } from '../v30-v31';
import {
    V29GearboxBinding,
    V29ServoBinding,
    V29SetAngleBinding,
    V29StepperBinding,
    V29Store,
    V29TrainBinding,
    V30GearboxBinding,
    V30ServoBinding,
    V30SetAngleBinding,
    V30SpeedBinding,
    V30StepperBinding,
    V30TrainBinding
} from './v29-store';
import { OldInputAction } from '../old-input-actions';

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

    it('should update speed keyboard input settings', () => {
        const speedBindings = v30Store.controlSchemes?.entities?.['Speed control test']?.bindings as V30SpeedBinding[];
        expect(speedBindings[0].inputs[SpeedBindingInputAction.Forwards]).toEqual({
            controllerId: 'keyboard',
            inputId: 'w',
            inputType: 0,
            gain: 0,
            inputDirection: InputDirection.Positive
        } satisfies V30SpeedBinding['inputs'][SpeedBindingInputAction.Forwards]);
        expect(speedBindings[0].inputs[SpeedBindingInputAction.Brake]).toEqual({
            controllerId: 'keyboard',
            inputId: 's',
            inputType: 0,
            gain: 0,
            inputDirection: InputDirection.Positive
        } satisfies V30SpeedBinding['inputs'][SpeedBindingInputAction.Brake]);
        expect(speedBindings[0].inputs[SpeedBindingInputAction.Backwards]).toBeUndefined();
    });

    it('should update speed gamepad input settings', () => {
        const speedBindings = v30Store.controlSchemes?.entities?.['Speed control test']?.bindings as V30SpeedBinding[];
        expect(speedBindings[1].inputs[SpeedBindingInputAction.Forwards]).toEqual({
            controllerId: 'gamepad-xbox360/0',
            inputId: '1',
            inputType: 1,
            gain: 0,
            inputDirection: InputDirection.Positive
        } satisfies V30SpeedBinding['inputs'][SpeedBindingInputAction.Forwards]);
        expect(speedBindings[1].inputs[SpeedBindingInputAction.Backwards]).toEqual({
            controllerId: 'gamepad-xbox360/0',
            inputId: '1',
            inputType: 1,
            gain: 0,
            inputDirection: InputDirection.Negative
        } satisfies V30SpeedBinding['inputs'][SpeedBindingInputAction.Backwards]);
        expect(speedBindings[1].inputs[SpeedBindingInputAction.Brake]).toEqual({
            controllerId: 'gamepad-xbox360/0',
            inputId: '0',
            inputType: 0,
            gain: 0,
            inputDirection: InputDirection.Positive
        } satisfies V30SpeedBinding['inputs'][SpeedBindingInputAction.Brake]);
    });

    it('should migrate servo binding inputs', () => {
        const v30servoBinding = v30Store.controlSchemes?.entities?.['Servo']?.bindings[0] as V30ServoBinding;
        const v29ServoBinding = v29Store.controlSchemes?.entities?.['Servo']?.bindings[0] as V29ServoBinding;
        expect(v30servoBinding.inputs[ServoBindingInputAction.Cw]).toEqual(v29ServoBinding.inputs[OldInputAction.ServoCw]);
        expect(v30servoBinding.inputs[ServoBindingInputAction.Ccw]).toEqual(v29ServoBinding.inputs[OldInputAction.ServoCcw]);
    });

    it('should migrate set angle binding input', () => {
        const v30setAngleBinding = v30Store.controlSchemes?.entities?.['Set angle']?.bindings[0] as V30SetAngleBinding;
        const v29setAngleBinding = v29Store.controlSchemes?.entities?.['Set angle']?.bindings[0] as V29SetAngleBinding;
        expect(v30setAngleBinding.inputs[SetAngleBindingInputAction.SetAngle]).toEqual(v29setAngleBinding.inputs[OldInputAction.SetAngle]);
    });

    it('should migrate stepper button binding input', () => {
        const v30stepperButtonBinding = v30Store.controlSchemes?.entities?.['Stepper']?.bindings[0] as V30StepperBinding;
        const v29stepperButtonBinding = v29Store.controlSchemes?.entities?.['Stepper']?.bindings[0] as V29StepperBinding;
        expect(v30stepperButtonBinding.inputs[StepperBindingInputAction.Cw]).toEqual(v29stepperButtonBinding.inputs[OldInputAction.Step]);
        expect(v30stepperButtonBinding.inputs[StepperBindingInputAction.Ccw]).toBeUndefined();
    });

    it('should migrate stepper axial binding input w/ inversion', () => {
        const v30stepperButtonBinding = v30Store.controlSchemes?.entities?.['Stepper']?.bindings[1] as V30StepperBinding;
        const v29stepperButtonBinding = v29Store.controlSchemes?.entities?.['Stepper']?.bindings[1] as V29StepperBinding;
        expect(v30stepperButtonBinding.inputs[StepperBindingInputAction.Ccw]).toEqual({
            ...v29stepperButtonBinding.inputs[OldInputAction.Step],
            inputDirection: InputDirection.Positive
        });
        expect(v30stepperButtonBinding.inputs[StepperBindingInputAction.Cw]).toEqual({
            ...v29stepperButtonBinding.inputs[OldInputAction.Step],
            inputDirection: InputDirection.Negative
        });
        expect(v30stepperButtonBinding.degree).toEqual(MOTOR_LIMITS.minServoDegreesRange);
    });

    it('should migrate train binding input', () => {
        const v30trainBinding = v30Store.controlSchemes?.entities?.['Speed shift']?.bindings[0] as V30TrainBinding;
        const v29trainBinding = v29Store.controlSchemes?.entities?.['Speed shift']?.bindings[0] as V29TrainBinding;
        expect(v30trainBinding.inputs[TrainBindingInputAction.NextSpeed]).toEqual(v29trainBinding.inputs[OldInputAction.NextLevel]);
        expect(v30trainBinding.inputs[TrainBindingInputAction.PrevSpeed]).toEqual(v29trainBinding.inputs[OldInputAction.PrevLevel]);
        expect(v30trainBinding.inputs[TrainBindingInputAction.Reset]).toEqual(v29trainBinding.inputs[OldInputAction.Reset]);
    });

    it('should migrate gearbox binding input', () => {
        const v30gearboxBinding = v30Store.controlSchemes?.entities?.['angle shift']?.bindings[0] as V30GearboxBinding;
        const v29gearboxBinding = v29Store.controlSchemes?.entities?.['angle shift']?.bindings[0] as V29GearboxBinding;
        expect(v30gearboxBinding.inputs[GearboxBindingInputAction.NextGear]).toEqual(v29gearboxBinding.inputs[OldInputAction.NextLevel]);
        expect(v30gearboxBinding.inputs[GearboxBindingInputAction.PrevGear]).toEqual(v29gearboxBinding.inputs[OldInputAction.PrevLevel]);
        expect(v30gearboxBinding.inputs[GearboxBindingInputAction.Reset]).toEqual(v29gearboxBinding.inputs[OldInputAction.Reset]);
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
