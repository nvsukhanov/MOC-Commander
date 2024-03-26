import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ScreenSizeObserverService } from '@app/shared-misc';
import { AppUpdatedNotificationComponent, ErrorNotificationComponent, InfoNotificationComponent } from '@app/shared-components';

@Injectable()
export class NotificationFacadeService {
    constructor(
        private readonly screenSizeObserverService: ScreenSizeObserverService,
        private readonly snackBar: MatSnackBar,
    ) {
    }

    public showInfoNotification(
        message$: Observable<string>
    ): void {
        this.screenSizeObserverService.isSmallScreen$.pipe(
            take(1)
        ).subscribe((isSmallScreen) => {
            this.snackBar.openFromComponent(
                InfoNotificationComponent,
                {
                    horizontalPosition: 'end',
                    verticalPosition: isSmallScreen ? 'top' : 'bottom',
                    duration: 5000,
                    data: message$
                }
            );
        });
    }

    public showErrorNotification(
        message$: Observable<string>
    ): void {
        this.screenSizeObserverService.isSmallScreen$.pipe(
            take(1)
        ).subscribe((isSmallScreen) => {
            this.snackBar.openFromComponent(
                ErrorNotificationComponent,
                {
                    horizontalPosition: 'end',
                    verticalPosition: isSmallScreen ? 'top' : 'bottom',
                    duration: 10000,
                    data: message$
                }
            );
        });
    }

    public showAppUpdatedNotification(): void {
        this.snackBar.openFromComponent(
            AppUpdatedNotificationComponent,
            {
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
                duration: Number.MAX_SAFE_INTEGER
            }
        );
    }
}
