import { FormControl } from '@angular/forms';

export function getFormControlMinValue(control: FormControl<number>): number {
  const v = control.validator;
  const tmpFormControl = new FormControl<number>(-Infinity, v);
  return tmpFormControl.errors?.['min']?.['min'] ?? -Infinity;
}

export function getFormControlMaxValue(control: FormControl<number>): number {
  const v = control.validator;
  const tmpFormControl = new FormControl<number>(Infinity, v);
  return tmpFormControl.errors?.['max']?.['max'] ?? Infinity;
}
