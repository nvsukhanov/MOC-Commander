import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { NAVIGATOR } from '../../types';
import { MatButtonModule } from '@angular/material/button';
import { ACTIONS_CONFIGURE_HUB, HubConnectionState, IState, SELECT_HUB_CONNECTION_STATE } from '../../store';
import { Store } from '@ngrx/store';
import { AsyncPipe, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
    standalone: true,
    selector: 'app-configure-hub-component',
    templateUrl: './configure-hub.component.html',
    styleUrls: [ './configure-hub.component.scss' ],
    imports: [
        MatButtonModule,
        AsyncPipe,
        NgIf,
        NgSwitch,
        NgSwitchCase,
        TranslocoModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigureHubComponent {
    public readonly connectionStates = HubConnectionState;

    public readonly connectionState$ = this.store.select(SELECT_HUB_CONNECTION_STATE);

    constructor(
        @Inject(NAVIGATOR) private readonly navigator: Navigator,
        private readonly store: Store<IState>,
    ) {
    }

    public connect(): void {
        this.store.dispatch(ACTIONS_CONFIGURE_HUB.startDiscovery());
    }

    public disconnect(): void {
        this.store.dispatch(ACTIONS_CONFIGURE_HUB.userRequestedHubDisconnection());
    }
}
