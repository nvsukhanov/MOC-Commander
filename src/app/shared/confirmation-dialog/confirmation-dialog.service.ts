import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { ConfirmationDialogComponent } from './confirmation-dialog.component';

@Injectable()
export class ConfirmationDialogService {
    constructor(
        private readonly dialogService: MatDialog
    ) {
    }

    public show(
        title$: Observable<string>,
        options?: {
            content$?: Observable<string>;
            confirmTitle$?: Observable<string>;
            cancelTitle$?: Observable<string>;
        }
    ): Observable<boolean> {
        return this.dialogService.open(ConfirmationDialogComponent, {
            data: {
                title$,
                content$: options?.content$,
                confirmTitle$: options?.confirmTitle$,
                cancelTitle$: options?.cancelTitle$
            }
        }).afterClosed().pipe(
            map((r) => !!r)
        );
    }
}
