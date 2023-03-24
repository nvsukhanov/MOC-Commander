import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { NAVIGATOR } from '../../types';
import { MatButtonModule } from '@angular/material/button';
import { ACTIONS_CONFIGURE_HUB, HubConnectionState, IState, SELECT_HUB_CONNECTION_STATE } from '../../store';
import { Store } from '@ngrx/store';
import { AsyncPipe, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { L10nPipe, L10nService } from '../../l10n';

@Component({
    standalone: true,
    selector: 'app-configure-hub-component',
    templateUrl: './configure-hub.component.html',
    styleUrls: [ './configure-hub.component.scss' ],
    imports: [
        MatButtonModule,
        AsyncPipe,
        NgIf,
        L10nPipe,
        NgSwitch,
        NgSwitchCase
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigureHubComponent {
    public readonly connectionStates = HubConnectionState;

    public readonly connectionState$ = this.store.select(SELECT_HUB_CONNECTION_STATE);

    constructor(
        @Inject(NAVIGATOR) private readonly navigator: Navigator,
        private readonly store: Store<IState>,
        private readonly l10n: L10nService
    ) {
    }

    public connect(): void {
        this.store.dispatch(ACTIONS_CONFIGURE_HUB.startDiscovery());
    }

    public disconnect(): void {
        this.store.dispatch(ACTIONS_CONFIGURE_HUB.userRequestedHubDisconnection());
    }
}
