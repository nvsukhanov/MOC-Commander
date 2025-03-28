import { Injectable } from '@angular/core';
import { AsyncValidatorFn, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TranslocoService } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { AppValidators } from '@app/shared-misc';

import { ControlSchemeValidators } from './validation';

@Injectable({ providedIn: 'root' })
export class ControlSchemeFormBuilderService {
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly translocoService: TranslocoService,
    private readonly store: Store,
  ) {}

  public controlSchemeNameControl(requireUniqueName: boolean = true): FormControl<string> {
    const asyncValidators: AsyncValidatorFn[] = [];
    if (requireUniqueName) {
      asyncValidators.push(ControlSchemeValidators.nameUniqueness(this.store));
    }
    return this.formBuilder.control<string>(this.translocoService.translate('controlScheme.newSchemeDialogDefaultName'), {
      nonNullable: true,
      validators: [AppValidators.requireNonEmptyString, AppValidators.requireNoLeadingOrTrailingSpaces],
      asyncValidators,
    });
  }

  public hubIdControl(): FormControl<string | null> {
    return this.formBuilder.control<string | null>(null, {
      nonNullable: false,
      validators: [Validators.required],
    });
  }

  public portIdControl(): FormControl<number | null> {
    return this.formBuilder.control<number | null>(null, {
      nonNullable: false,
      validators: [Validators.required, Validators.min(0), Validators.max(0xff)],
    });
  }
}
