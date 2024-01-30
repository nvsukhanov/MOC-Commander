import { AbstractControl, ValidationErrors } from '@angular/forms';

import { GlobalValidationErrors } from './global-validation-errors';
import { getEnumValues } from '../get-enum-values';

export class AppValidators {
    public static requireNonZero(
        control: AbstractControl<number>
    ): ValidationErrors | null {
        return control.value === 0 ? { [GlobalValidationErrors.valueShouldNotBeZero]: true } : null;
    }

    public static requireInteger(
        control: AbstractControl<number>
    ): ValidationErrors | null {
        return Number.isInteger(control.value) ? null : { [GlobalValidationErrors.valueShouldBeInteger]: true };
    }

    public static isInEnum(
        enumObject: { [k in string]: string | number }
    ): (control: AbstractControl<string>) => ValidationErrors | null {
        return (
            control: AbstractControl<string>
        ): ValidationErrors | null => {
            return getEnumValues(enumObject).includes(control.value) ? null : { [GlobalValidationErrors.valueIsNotInEnum]: true };
        };
    }

    public static requireBoolean(
        control: AbstractControl<boolean>
    ): ValidationErrors | null {
        // noinspection PointlessBooleanExpressionJS (it's not pointless, it's a type guard)
        return control.value === true || control.value === false ? null : { [GlobalValidationErrors.valueIsNotBoolean]: true };
    }
}
