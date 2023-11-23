import { Injectable, OnDestroy } from '@angular/core';
import { Observable, map } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ConfirmationDialogComponent } from './confirmation-dialog.component';

@Injectable()
export class ConfirmationDialogService implements OnDestroy {
    private dialogRef: MatDialogRef<ConfirmationDialogComponent> | null = null;

    constructor(
        private readonly dialogService: MatDialog
    ) {
    }

    public confirm(
        title$: Observable<string>,
        options?: {
            content$?: Observable<string>;
            confirmTitle$?: Observable<string>;
            cancelTitle$?: Observable<string>;
        }
    ): Observable<boolean> {
        if (this.dialogRef !== null) {
            this.dialogRef.close();
        }
        this.dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
            data: {
                title$,
                content$: options?.content$,
                confirmTitle$: options?.confirmTitle$,
                cancelTitle$: options?.cancelTitle$
            }
        });
        return this.dialogRef.afterClosed().pipe(
            map((r) => !!r)
        );
    }

    public ngOnDestroy(): void {
        if (this.dialogRef !== null) {
            this.dialogRef.close();
        }
    }
}
