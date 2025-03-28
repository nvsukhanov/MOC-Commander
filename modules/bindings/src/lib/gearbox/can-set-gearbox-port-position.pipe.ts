import { Pipe, PipeTransform } from '@angular/core';
import { Observable, merge, of, startWith, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { PortModeName } from 'rxpoweredup';

import { BINDING_EDIT_COMMON_SELECTORS as BINDING_EDIT_SELECTORS } from '../common';
import { GearboxBindingForm } from './gearbox-binding-form';

@Pipe({
  standalone: true,
  name: 'canSetGearboxPortPosition',
  pure: true,
})
export class CanSetGearboxPortPositionPipe implements PipeTransform {
  constructor(private readonly store: Store) {}

  public transform(form: GearboxBindingForm, levelIndex: number): Observable<boolean> {
    const angleControl = form.controls.angles.controls[levelIndex];
    return merge([form.controls.hubId.valueChanges, form.controls.portId.valueChanges, angleControl]).pipe(
      startWith(null),
      switchMap(() => {
        if (form.controls.hubId.value === null || form.controls.portId.value === null || angleControl.invalid) {
          return of(false);
        }
        return this.store.select(
          BINDING_EDIT_SELECTORS.canSetPortValue({
            hubId: form.controls.hubId.value,
            portId: form.controls.portId.value,
            portModeName: PortModeName.position,
          }),
        );
      }),
    );
  }
}
