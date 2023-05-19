import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslocoModule } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { HUBS_ACTIONS, HUBS_SELECTORS } from '../../../store';
import { MatListModule } from '@angular/material/list';
import { LetModule, PushModule } from '@ngrx/component';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { HubsListItemComponent } from '../hubs-list-item';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FeatureContentContainerComponent, FeatureToolbarComponent } from '../../../common';
import { MatCardModule } from '@angular/material/card';

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
        MatButtonModule,
        JsonPipe,
        MatIconModule,
        FeatureContentContainerComponent,
        FeatureToolbarComponent,
        MatCardModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubsListComponent {
    public readonly connectedHubs$ = this.store.select(HUBS_SELECTORS.selectHubs);

    constructor(
        private readonly store: Store
    ) {
    }

    public hubTrackByFn(index: number, hub: { hubId: string }): string {
        return hub.hubId;
    }

    public disconnectHub(hubId: string): void {
        this.store.dispatch(HUBS_ACTIONS.userRequestedHubDisconnection({ hubId }));
    }
}
