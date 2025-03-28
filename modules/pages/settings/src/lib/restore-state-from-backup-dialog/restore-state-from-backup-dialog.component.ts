import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ValidationErrorsL10nMap, ValidationMessagesDirective } from '@app/shared-misc';
import { UploadFileFormControlComponent } from '@app/shared-components';
import { AppStoreVersion, IState, MigrateStoreService } from '@app/store';

import { STATE_FILE_VALIDATION_ERRORS, createStateFileValidatorFn } from './state-file-validator-fn';

@Component({
  standalone: true,
  selector: 'page-settings-restore-state-from-backup-dialog',
  templateUrl: './restore-state-from-backup-dialog.component.html',
  styleUrl: './restore-state-from-backup-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule, MatButtonModule, TranslocoPipe, MatInputModule, ValidationMessagesDirective, UploadFileFormControlComponent, ReactiveFormsModule],
})
export class RestoreStateFromBackupDialogComponent {
  public readonly control: FormControl<string | null>;

  public readonly errorsMap: ValidationErrorsL10nMap = {
    [STATE_FILE_VALIDATION_ERRORS.invalidFile]: 'settings.restoreStateFromBackupDialogFileCorrupted',
  };

  constructor(
    private readonly dialog: MatDialogRef<RestoreStateFromBackupDialogComponent>,
    formBuilder: FormBuilder,
    private readonly migrationService: MigrateStoreService,
  ) {
    this.control = formBuilder.control<string | null>('', {
      nonNullable: false,
      validators: [Validators.required, createStateFileValidatorFn(migrationService)],
    });
  }

  public onSave(): void {
    const fileStringContent = this.control.value;
    if (!fileStringContent) {
      throw new Error('File content is empty');
    }
    const data = JSON.parse(fileStringContent) as IState;
    this.dialog.close(this.migrationService.migrateToVersion(data, AppStoreVersion.latest));
  }

  public onCancel(): void {
    this.dialog.close();
  }
}
