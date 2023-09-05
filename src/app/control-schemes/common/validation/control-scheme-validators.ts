import { Store } from '@ngrx/store';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, map, startWith, take } from 'rxjs';
import { concatLatestFrom } from '@ngrx/effects';
import { getEnumValues } from '@app/shared';

import { CONTROL_SCHEMES_VALIDATION_SELECTORS } from './control-schemes-validation.selectors';
import {
    CONTROL_SCHEME_NAME_IS_NOT_UNIQUE,
    VALUE_IS_NOT_BOOLEAN,
    VALUE_IS_NOT_INTEGER,
    VALUE_IS_NOT_IN_ENUM,
    VALUE_IS_ZERO
} from './control-schemes-validation-errors';

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
        enumObject: { [k in string]: string | number }
    ): (control: AbstractControl<string>) => ValidationErrors | null {
        return (
            control: AbstractControl<string>
        ): ValidationErrors | null => {
            return getEnumValues(enumObject).includes(control.value) ? null : { [VALUE_IS_NOT_IN_ENUM]: true };
        };
    }

    public static requireBoolean(
        control: AbstractControl<boolean>
    ): ValidationErrors | null {
        // noinspection PointlessBooleanExpressionJS (it's not pointless, it's a type guard)
        return control.value === true || control.value === false ? null : { [VALUE_IS_NOT_BOOLEAN]: true };
    }

    public static requireNonZero(
        control: AbstractControl<number>
    ): ValidationErrors | null {
        return control.value === 0 ? { [VALUE_IS_ZERO]: true } : null;
    }

    public static requireInteger(
        control: AbstractControl<number>
    ): ValidationErrors | null {
        return Number.isInteger(control.value) ? null : { [VALUE_IS_NOT_INTEGER]: true };
    }
}
