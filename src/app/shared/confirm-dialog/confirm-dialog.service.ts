import { Injectable } from '@angular/core';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Observable, map, merge, take, tap } from 'rxjs';

import { ConfirmDialogComponent } from './confirm-dialog.component';

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
    private readonly dialogRefs = new Map<unknown, DialogRef<unknown, ConfirmDialogComponent>>();

    constructor(
        private readonly dialogService: Dialog
    ) {
    }

    public show(
        title$: Observable<string>,
        host: unknown,
        options?: {
            content$?: Observable<string>;
            confirmTitle$?: Observable<string>;
            cancelTitle$?: Observable<string>;
        }
    ): Observable<boolean> {
        this.disposeAllDialogs();
        const dialogRef = this.dialogService.open(ConfirmDialogComponent, {
            hasBackdrop: true,
            disableClose: true,
        });
        if (!dialogRef.componentInstance) {
            throw new Error('Component instance is undefined'); // will never happen since we pass a component class, not a template
        }

        dialogRef.componentInstance.title$ = title$;
        if (options?.confirmTitle$) {
            dialogRef.componentInstance.confirmTitle$ = options.confirmTitle$;
        }
        if (options?.cancelTitle$) {
            dialogRef.componentInstance.cancelTitle$ = options.cancelTitle$;
        }
        if (options?.content$) {
            dialogRef.componentInstance.content$ = options.content$;
        }
        this.dialogRefs.set(host, dialogRef);
        return merge(
            dialogRef.componentInstance.confirm.pipe(map(() => true)),
            dialogRef.componentInstance.cancel.pipe(map(() => false))
        ).pipe(
            take(1),
            tap(() => {
                this.hide(host);
            })
        );
    }

    public hide(
        host: unknown
    ): void {
        const dialogRef = this.dialogRefs.get(host);
        if (dialogRef) {
            dialogRef.close();
            this.dialogRefs.delete(host);
        }
    }

    private disposeAllDialogs(): void {
        for (const dialogRef of this.dialogRefs.values()) {
            dialogRef.close();
        }
        this.dialogRefs.clear();
    }
}
