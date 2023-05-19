import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
    standalone: true,
    selector: 'app-hub-is-not-connected-notification',
    templateUrl: './hub-is-not-connected-notification.component.html',
    styleUrls: [ './hub-is-not-connected-notification.component.scss' ],
    imports: [
        TranslocoModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubIsNotConnectedNotificationComponent {

}
