import { Signal, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, first, from, of, switchMap } from 'rxjs';

import { LeavingRunningSchemeConfirmationDialogComponent } from './leaving-running-scheme-confirmation-dialog.component';

function guard(isSchemeRunning: boolean, dialog: MatDialog): Observable<boolean> {
  if (!isSchemeRunning) {
    return of(true);
  }
  return dialog.open(LeavingRunningSchemeConfirmationDialogComponent).afterClosed();
}

export interface ISchemeRunnerComponent {
  readonly isSchemeRunning: Signal<boolean>;
}

export function leavingRunningSchemeGuardFn(
  component: ISchemeRunnerComponent,
): Promise<boolean> | Observable<boolean> | boolean {
  const dialog = inject(MatDialog);
  return of(component.isSchemeRunning()).pipe(
    switchMap((hasUnsavedChanges) => from(guard(hasUnsavedChanges, dialog))),
    first(),
  );
}
