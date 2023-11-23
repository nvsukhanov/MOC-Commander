import { AbstractControl, ValidationErrors } from '@angular/forms';

import { GlobalValidationErrors } from './global-validation-errors';

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
}
