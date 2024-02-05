import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoPipe } from '@ngneat/transloco';
import { RouterLink } from '@angular/router';
import { RoutesBuilderService } from '@app/shared-misc';

@Component({
    standalone: true,
    selector: 'page-main-bluetooth-unavailable-notification',
    templateUrl: './bluetooth-unavailable-notification.component.html',
    styleUrls: [ './bluetooth-unavailable-notification.component.scss' ],
    imports: [
        TranslocoPipe,
        RouterLink
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BluetoothUnavailableNotificationComponent {
    public readonly canIUseBluetoothLink = 'https://caniuse.com/web-bluetooth';

    public readonly installationManual = this.routesBuilder.help;

    constructor(
        private readonly routesBuilder: RoutesBuilderService,
    ) {
    }
}
