import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { HUBS_ACTIONS, HUBS_SELECTORS } from '../../../store';
import { LetDirective, PushPipe } from '@ngrx/component';
import { NgForOf, NgIf } from '@angular/common';
import { HubsListItemComponent } from '../hubs-list-item';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

@Component({
    standalone: true,
    selector: 'app-hubs-list',
    templateUrl: './hubs-list.component.html',
    styleUrls: [ './hubs-list.component.scss' ],
    imports: [
        TranslocoModule,
        LetDirective,
        PushPipe,
        NgIf,
        HubsListItemComponent,
        NgForOf,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatDividerModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubsListComponent {
    public readonly connectedHubs$ = this.store.select(HUBS_SELECTORS.selectHubsWithConnectionState);

    constructor(
        private readonly store: Store
    ) {
    }

    public hubTrackByFn(
        index: number,
        hub: { hubId: string }
    ): string {
        return hub.hubId;
    }

    public disconnectHub(
        hubId: string
    ): void {
        this.store.dispatch(HUBS_ACTIONS.userRequestedHubDisconnection({ hubId }));
    }

    public forgetHub(
        hubId: string
    ): void {
        this.store.dispatch(HUBS_ACTIONS.forgetHub({ hubId }));
    }
}
