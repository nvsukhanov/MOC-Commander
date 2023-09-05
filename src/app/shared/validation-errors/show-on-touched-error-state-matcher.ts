import { ErrorStateMatcher } from '@angular/material/core';
import { AbstractControl } from '@angular/forms';

export class ShowOnTouchedErrorStateMatcher implements ErrorStateMatcher {
    public isErrorState(
        control: AbstractControl | null
    ): boolean {
        return (control?.touched && control.invalid) ?? false;
    }
}
