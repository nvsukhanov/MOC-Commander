import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, first, from, of, switchMap } from 'rxjs';

import { UnsavedChangedConfirmationDialogComponent } from './unsaved-changed-confirmation-dialog.component';

function guard(hasUnsavedChanges: boolean, dialog: MatDialog): Observable<boolean> {
  if (!hasUnsavedChanges) {
    return of(true);
  }
  return dialog.open(UnsavedChangedConfirmationDialogComponent).afterClosed();
}

export interface IUnsavedChangesComponent {
  readonly hasUnsavedChanges: boolean | Observable<boolean>;
}

export function hasUnsavedChangesGuardFn(
  component: IUnsavedChangesComponent,
): Promise<boolean> | Observable<boolean> | boolean {
  const dialog = inject(MatDialog);
  if (component.hasUnsavedChanges === true || component.hasUnsavedChanges === false) {
    return guard(component.hasUnsavedChanges, dialog);
  }
  return component.hasUnsavedChanges.pipe(
    switchMap((hasUnsavedChanges) => from(guard(hasUnsavedChanges, dialog))),
    first(),
  );
}
