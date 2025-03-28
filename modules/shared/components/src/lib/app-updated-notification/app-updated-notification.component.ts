import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatSnackBarAction, MatSnackBarActions, MatSnackBarLabel, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { RoutesBuilderService } from '@app/shared-misc';

@Component({
    standalone: true,
    selector: 'lib-app-updated-notification',
    templateUrl: './app-updated-notification.component.html',
    styleUrl: './app-updated-notification.component.scss',
    imports: [
        MatSnackBarLabel,
        MatSnackBarActions,
        MatSnackBarAction,
        MatButton,
        RouterLink,
        TranslocoPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppUpdatedNotificationComponent {
    public readonly snackBarRef = inject(MatSnackBarRef);

    public readonly routeBuilder = inject(RoutesBuilderService);

    public onDismiss(): void {
        this.snackBarRef.dismiss();
    }
}
