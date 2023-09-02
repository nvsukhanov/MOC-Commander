import { Store } from '@ngrx/store';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, map, startWith, take } from 'rxjs';
import { concatLatestFrom } from '@ngrx/effects';

import { CONTROL_SCHEMES_VALIDATION_SELECTORS } from './control-schemes-validation.selectors';
import { CONTROL_SCHEME_NAME_IS_NOT_UNIQUE, VALUE_IS_NOT_BOOLEAN, VALUE_IS_NOT_IN_ENUM, VALUE_IS_ZERO } from './control-schemes-validation-errors';

export class ControlSchemeValidators {
    public static nameUniqueness(
        store: Store
    ): AsyncValidatorFn {
        return (
            control: AbstractControl<string>
        ): Observable<ValidationErrors | null> => {
            return control.valueChanges.pipe(
                startWith(control.value),
                concatLatestFrom((name) => store.select(CONTROL_SCHEMES_VALIDATION_SELECTORS.selectControlSchemeNameIsNotUnique(name))),
                map(([ , isNotUnique ]) => {
                    return isNotUnique ? { [CONTROL_SCHEME_NAME_IS_NOT_UNIQUE]: true } : null;
                }),
                take(1)
            );
        };
    }

    public static isInEnum(
        enumObject: Record<string, unknown>
    ): (control: AbstractControl<string>) => ValidationErrors | null {
        return (
            control: AbstractControl<string>
        ): ValidationErrors | null => {
            return Object.values(enumObject).includes(control.value) ? null : { [VALUE_IS_NOT_IN_ENUM]: true };
        };
    }

    public static requireBoolean(
        control: AbstractControl<boolean>
    ): ValidationErrors | null {
        return control.value === true || control.value === false ? null : { [VALUE_IS_NOT_BOOLEAN]: true };
    }

    public static requireNonZero(
        control: AbstractControl<number>
    ): ValidationErrors | null {
        return control.value === 0 ? { [VALUE_IS_ZERO]: true } : null;
    }
}
