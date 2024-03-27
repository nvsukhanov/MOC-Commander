import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarLabel } from '@angular/material/snack-bar';
import { TranslocoPipe } from '@ngneat/transloco';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
    standalone: true,
    selector: 'lib-info-notification',
    templateUrl: './info-notification.component.html',
    styleUrls: [ './info-notification.component.scss' ],
    imports: [
        MatSnackBarLabel,
        TranslocoPipe,
        AsyncPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfoNotificationComponent {
    constructor(
        @Inject(MAT_SNACK_BAR_DATA) public readonly caption$: Observable<string>
    ) {
    }
}
