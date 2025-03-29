import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { ValidationErrorsL10nMap, ValidationMessagesDirective } from '@app/shared-misc';
import { CONTROL_SCHEME_NAME_IS_NOT_UNIQUE, ControlSchemeFormBuilderService } from '@app/shared-control-schemes';
import { CONTROL_SCHEME_SELECTORS } from '@app/store';

@Component({
  standalone: true,
  selector: 'page-control-schemes-list-control-scheme-create-dialog',
  templateUrl: './control-scheme-create-dialog.component.html',
  styleUrl: './control-scheme-create-dialog.component.scss',
  imports: [
    MatDialogModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    TranslocoPipe,
    ValidationMessagesDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlSchemeCreateDialogComponent {
  protected readonly nameFormControl: FormControl<string>;

  protected readonly validationErrorsL10nMap: ValidationErrorsL10nMap = {
    required: 'controlScheme.newSchemeDialogNameRequired',
    [CONTROL_SCHEME_NAME_IS_NOT_UNIQUE]: 'controlScheme.newSchemeDialogNameUniqueness',
  };

  constructor(
    private readonly dialogRef: MatDialogRef<ControlSchemeCreateDialogComponent, { name: string }>,
    private readonly formBuilder: ControlSchemeFormBuilderService,
    store: Store,
  ) {
    this.nameFormControl = this.formBuilder.controlSchemeNameControl(true);
    store
      .select(CONTROL_SCHEME_SELECTORS.selectNextSchemeName(this.nameFormControl.value))
      .pipe(take(1))
      .subscribe((nextName) => {
        this.nameFormControl.setValue(nextName);
      });
  }

  public canSubmit(): boolean {
    return this.nameFormControl.valid;
  }

  public onSubmit(event: Event): void {
    event.preventDefault();
    if (this.canSubmit()) {
      this.dialogRef.close({
        name: this.nameFormControl.value,
      });
    }
  }

  public onCancel(): void {
    this.dialogRef.close();
  }
}
