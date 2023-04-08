import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslocoModule } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { ACTIONS_CONFIGURE_HUB, IState, SELECT_CAN_ADD_HUB, SELECT_CONNECTED_HUBS } from '../../store';
import { MatListModule } from '@angular/material/list';
import { LetModule, PushModule } from '@ngrx/component';
import { NgForOf, NgIf } from '@angular/common';
import { HubsListItemComponent } from '../hubs-list-item';
import { MatButtonModule } from '@angular/material/button';

@Component({
    standalone: true,
    selector: 'app-hubs-list',
    templateUrl: './hubs-list.component.html',
    styleUrls: [ './hubs-list.component.scss' ],
    imports: [
        MatExpansionModule,
        TranslocoModule,
        MatListModule,
        LetModule,
        PushModule,
        NgIf,
        HubsListItemComponent,
        NgForOf,
        MatButtonModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubsListComponent {
    public readonly connectedHubs$ = this.store.select(SELECT_CONNECTED_HUBS);

    public readonly canAddHub$ = this.store.select(SELECT_CAN_ADD_HUB);

    constructor(
        private readonly store: Store<IState>
    ) {
    }

    public hubTrackByFn(index: number, hub: { id: number }): number {
        return hub.id;
    }

    public addHub(): void {
        this.store.dispatch(ACTIONS_CONFIGURE_HUB.startDiscovery());
    }

    public disconnectHub(id: number): void {
        this.store.dispatch(ACTIONS_CONFIGURE_HUB.userRequestedHubDisconnection());
    }
}
