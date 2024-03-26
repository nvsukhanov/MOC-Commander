import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_SNACK_BAR_DATA, MatSnackBarAction, MatSnackBarActions, MatSnackBarLabel, MatSnackBarRef } from '@angular/material/snack-bar';
import { TranslocoPipe } from '@ngneat/transloco';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
    standalone: true,
    selector: 'lib-info-notification',
    templateUrl: './info-notification.component.html',
    styleUrls: [ './info-notification.component.scss' ],
    imports: [
        MatButton,
        MatSnackBarAction,
        MatSnackBarActions,
        MatSnackBarLabel,
        TranslocoPipe,
        AsyncPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfoNotificationComponent {
    public readonly snackBarRef = inject(MatSnackBarRef);

    constructor(
        @Inject(MAT_SNACK_BAR_DATA) public readonly caption$: Observable<string>
    ) {
    }


    public onDismiss(): void {
        this.snackBarRef.dismiss();
    }
}
