import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgIf } from '@angular/common';
import { PushPipe } from '@ngrx/component';
import { TranslocoModule } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BLUETOOTH_AVAILABILITY_SELECTORS, HUBS_ACTIONS, HUBS_SELECTORS, } from '@app/store';
import { EllipsisTitleDirective } from '@app/shared';

import { RoutesBuilderService } from '../../routing';
import { MAIN_SELECTORS } from '../main.selectors';

@Component({
    standalone: true,
    selector: 'app-nav-menu',
    templateUrl: './nav-menu.component.html',
    styleUrls: [ './nav-menu.component.scss' ],
    imports: [
        MatButtonModule,
        MatToolbarModule,
        NgIf,
        PushPipe,
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
    public readonly connectedControllersCount$ = this.store.select(MAIN_SELECTORS.selectConnectedControllersCount);

    public readonly connectedHubCount$ = this.store.select(MAIN_SELECTORS.selectConnectedHubsCount);

    public readonly controlSchemesCount$ = this.store.select(MAIN_SELECTORS.selectControlSchemesCount);

    public readonly isBluetoothAvailable = this.store.select(BLUETOOTH_AVAILABILITY_SELECTORS.isAvailable);

    public readonly isDiscoveryBusy$ = this.store.select(HUBS_SELECTORS.selectIsDiscovering);

    @Input() public compact = false;

    constructor(
        private readonly store: Store,
        public readonly routesBuilderService: RoutesBuilderService
    ) {
    }

    public startDiscovery(): void {
        this.store.dispatch(HUBS_ACTIONS.startDiscovery());
    }
}
