import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CONFIGURE_CONTROLLER_ROUTE, CONFIGURE_HUB_ROUTE } from '../routes';
import { MatTableModule } from '@angular/material/table';
import { L10nPipe } from '../l10n';
import { Store } from '@ngrx/store';
import {
    ControllerConnectionState,
    HubConnectionState,
    IState,
    SELECT_BLUETOOTH_AVAILABILITY,
    SELECT_CONTROLLER_CONNECTION_STATE,
    SELECT_HUB_CONNECTION_STATE
} from '../store';
import { AsyncPipe } from '@angular/common';
import { StatusBarComponent } from '../status-bar';
import { map } from 'rxjs';

@Component({
    standalone: true,
    selector: 'app-root',
    templateUrl: './layout.component.html',
    styleUrls: [ './layout.component.scss' ],
    imports: [
        RouterOutlet,
        MatToolbarModule,
        MatButtonModule,
        RouterLink,
        MatTableModule,
        L10nPipe,
        AsyncPipe,
        StatusBarComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent {
    public readonly configureControllerRoute = CONFIGURE_CONTROLLER_ROUTE;
    public readonly configureHubRoute = CONFIGURE_HUB_ROUTE;

    public isBluetoothAvailable$ = this.store.select(SELECT_BLUETOOTH_AVAILABILITY);
    public isControllerConnected$ = this.store.select(SELECT_CONTROLLER_CONNECTION_STATE).pipe(
        map((t) => t === ControllerConnectionState.Connected)
    );

    public isHubConnected$ = this.store.select(SELECT_HUB_CONNECTION_STATE).pipe(
        map((t) => t === HubConnectionState.Connected)
    );

    constructor(
        private readonly store: Store<IState>
    ) {
    }
}
