import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CONFIGURE_CONTROLLER_ROUTE, CONFIGURE_HUB_ROUTE } from '../routes';
import { MatTableModule } from '@angular/material/table';
import { L10nPipe } from '../l10n';
import { Store } from '@ngrx/store';
import { IState, SELECT_BLUETOOTH_AVAILABILITY } from '../store';
import { AsyncPipe } from '@angular/common';

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
        AsyncPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent {
    public readonly configureControllerRoute = CONFIGURE_CONTROLLER_ROUTE;
    public readonly configureHubRoute = CONFIGURE_HUB_ROUTE;
    public isBluetoothAvailable$ = this.store.select(SELECT_BLUETOOTH_AVAILABILITY);

    constructor(
        private readonly store: Store<IState>
    ) {
    }
}
