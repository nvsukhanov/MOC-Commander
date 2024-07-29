import { Store } from '@ngrx/store';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, map, startWith, take } from 'rxjs';
import { concatLatestFrom } from '@ngrx/operators';

import { CONTROL_SCHEMES_VALIDATION_SELECTORS } from './control-schemes-validation.selectors';
import { CONTROL_SCHEME_NAME_IS_NOT_UNIQUE } from './control-schemes-validation-errors';

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
}
