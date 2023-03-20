import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CONFIGURE_CONTROLLER_ROUTE, CONFIGURE_HUB_ROUTE } from '../../routes';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { L10nPipe } from '../../l10n';

@Component({
    standalone: true,
    selector: 'app-navigation-component',
    templateUrl: './navigation.component.html',
    styleUrls: [ './navigation.component.scss' ],
    imports: [
        MatToolbarModule,
        RouterLink,
        MatButtonModule,
        L10nPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationComponent {
    @Input() public isBluetoothAvailable?: boolean;

    public readonly configureControllerRoute = CONFIGURE_CONTROLLER_ROUTE;
    public readonly configureHubRoute = CONFIGURE_HUB_ROUTE;
}
