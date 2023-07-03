/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { LetDirective, PushPipe } from '@ngrx/component';
import { EMPTY, Observable, switchMap, take } from 'rxjs';
import { NgForOf, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { TranslocoModule } from '@ngneat/transloco';
import { Router } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

import { NotFoundComponent } from '@app/shared';
import { HubPropertiesViewComponent } from '../hub-properties-view';
import { HubIoViewComponent } from '../hub-io-view';
import { HUBS_ACTIONS, HUBS_SELECTORS, HUB_STATS_SELECTORS, HubModel, HubStatsModel, ROUTER_SELECTORS, attachedIosIdFn, } from '../../../store';
import { RoutesBuilderService } from '../../../routing';
import { HUB_VIEW_SELECTORS, HubIoViewModel } from '../hub-view.selectors';

@Component({
    standalone: true,
    selector: 'app-hub-view',
    templateUrl: './hub-view.component.html',
    styleUrls: [ './hub-view.component.scss' ],
    imports: [
        PushPipe,
        LetDirective,
        MatButtonModule,
        NgIf,
        NgForOf,
        MatDividerModule,
        TranslocoModule,
        HubPropertiesViewComponent,
        HubIoViewComponent,
        NotFoundComponent,
        MatDialogModule,
        MatCardModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubViewComponent {
    public readonly selectedHub$: Observable<HubModel | undefined> = this.store.select(ROUTER_SELECTORS.selectRouteParam('id')).pipe(
        switchMap((id) => id === undefined ? EMPTY : this.store.select(HUBS_SELECTORS.selectHub(id)))
    );

    public readonly selectedHubStats$: Observable<HubStatsModel | undefined> = this.store.select(ROUTER_SELECTORS.selectRouteParam('id')).pipe(
        switchMap((id) => id === undefined ? EMPTY : this.store.select(HUB_STATS_SELECTORS.selectByHubId(id)))
    );

    public readonly ioFullInfoList$: Observable<HubIoViewModel[]> = this.store.select(ROUTER_SELECTORS.selectRouteParam('id')).pipe(
        switchMap((id) => id === undefined ? EMPTY : this.store.select(HUB_VIEW_SELECTORS.selectFullIosInfoForHub(id)))
    );

    constructor(
        private readonly store: Store,
        private readonly router: Router,
        private readonly routesBuilderService: RoutesBuilderService,
    ) {
    }

    public disconnectHub(): void {
        this.store.select(ROUTER_SELECTORS.selectRouteParam('id')).pipe(
            take(1)
        ).subscribe((id) => {
            if (id === undefined) {
                return;
            }
            this.store.dispatch(HUBS_ACTIONS.userRequestedHubDisconnection({ hubId: id }));
        });
        this.router.navigate(this.routesBuilderService.hubsList);
    }

    public hubIoTrackByFn(
        index: number,
        item: HubIoViewModel
    ): string {
        return attachedIosIdFn(item);
    }
}
