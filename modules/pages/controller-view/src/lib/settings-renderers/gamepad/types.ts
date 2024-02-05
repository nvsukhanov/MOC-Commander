import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { ControllerType, GamepadAxisSettings, GamepadButtonSettings } from '@app/controller-profiles';
import { ToFormGroup } from '@app/shared-misc';

export type AxisSettingsForm = ToFormGroup<GamepadAxisSettings>;
export type ButtonSettingsForm = ToFormGroup<GamepadButtonSettings>;

export type GamepadSettingsAxisSettingsViewModel = {
    inputId: string;
    form: AxisSettingsForm;
    name$: Observable<string>;
    rawValue$: Observable<number>;
    outputValue$: Observable<number>;
    isActivated$: Observable<boolean>;
    areSettingsDefault$: Observable<boolean>;
};

export type GamepadSettingsButtonSettingsViewModel = {
    inputId: string;
    form: ButtonSettingsForm;
    name$: Observable<string>;
    rawValue$: Observable<number>;
    outputValue$: Observable<number>;
    isActivated$: Observable<boolean>;
    areSettingsDefault$: Observable<boolean>;
};

export type GamepadSettingsViewModel = {
    axes: GamepadSettingsAxisSettingsViewModel[];
    buttons: GamepadSettingsButtonSettingsViewModel[];
    ignoreInputControl: FormControl<boolean>;
};

export type GamepadSettingsForm = FormGroup<{
    controllerId: FormControl<string>;
    controllerType: FormControl<ControllerType.Gamepad>;
    axisConfigs: FormGroup<{ [k in string]: AxisSettingsForm }>;
    buttonConfigs: FormGroup<{ [k in string]: ButtonSettingsForm }>;
    ignoreInput: FormControl<boolean>;
}>;
