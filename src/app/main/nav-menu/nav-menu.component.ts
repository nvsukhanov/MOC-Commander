import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgIf } from '@angular/common';
import { PushModule } from '@ngrx/component';
import { TranslocoModule } from '@ngneat/transloco';
import {
    BLUETOOTH_AVAILABILITY_SELECTORS,
    CONTROL_SCHEME_SELECTORS,
    GAMEPAD_SELECTORS,
    HUB_DISCOVERY_STATE_SELECTORS,
    HUBS_ACTIONS,
    HUBS_SELECTORS
} from '../../store';
import { Store } from '@ngrx/store';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ROUTE_PATHS } from '../../routes';
import { EllipsisTitleDirective } from '../../common';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    standalone: true,
    selector: 'app-nav-menu',
    templateUrl: './nav-menu.component.html',
    styleUrls: [ './nav-menu.component.scss' ],
    imports: [
        MatButtonModule,
        MatToolbarModule,
        NgIf,
        PushModule,
        TranslocoModule,
        RouterLink,
        RouterLinkActive,
        EllipsisTitleDirective,
        MatIconModule,
        MatBadgeModule,
        MatProgressSpinnerModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavMenuComponent {
    public readonly connectedControllersCount$ = this.store.select(GAMEPAD_SELECTORS.selectGamepadsCount);

    public readonly connectedHubCount$ = this.store.select(HUBS_SELECTORS.selectHubsCount);

    public readonly controlSchemesCount$ = this.store.select(CONTROL_SCHEME_SELECTORS.selectSchemesCount);

    public readonly isBluetoothAvailable = this.store.select(BLUETOOTH_AVAILABILITY_SELECTORS.isAvailable);

    public readonly isDiscoveryBusy$ = this.store.select(HUB_DISCOVERY_STATE_SELECTORS.isDiscoveryBusy);

    public readonly routePaths = ROUTE_PATHS;

    @Input() public compact = false;

    constructor(
        private readonly store: Store
    ) {
    }

    public startDiscovery(): void {
        this.store.dispatch(HUBS_ACTIONS.startDiscovery());
    }
}
