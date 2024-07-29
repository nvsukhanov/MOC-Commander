import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_SNACK_BAR_DATA, MatSnackBarAction, MatSnackBarActions, MatSnackBarLabel, MatSnackBarRef } from '@angular/material/snack-bar';
import { TranslocoPipe } from '@jsverse/transloco';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
    standalone: true,
    selector: 'lib-error-notification',
    templateUrl: './error-notification.component.html',
    styleUrls: [ './error-notification.component.scss' ],
    imports: [
        MatButton,
        MatSnackBarAction,
        MatSnackBarActions,
        MatSnackBarLabel,
        TranslocoPipe,
        AsyncPipe,
        MatIcon
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorNotificationComponent {
    public readonly snackBarRef = inject(MatSnackBarRef);

    constructor(
        @Inject(MAT_SNACK_BAR_DATA) public readonly error$: Observable<string>
    ) {
    }


    public onDismiss(): void {
        this.snackBarRef.dismiss();
    }
}
