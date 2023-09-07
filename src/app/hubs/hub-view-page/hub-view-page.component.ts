import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { LetDirective, PushPipe } from '@ngrx/component';
import { EMPTY, Observable, switchMap, take } from 'rxjs';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { Router } from '@angular/router';
import { RoutesBuilderService } from '@app/routing';
import { HUBS_ACTIONS, HUBS_SELECTORS, HUB_STATS_SELECTORS, HubModel, HubStatsModel, ROUTER_SELECTORS, attachedIosIdFn, } from '@app/store';

import { HubPropertiesViewComponent } from './hub-properties-view';
import { HubIoViewComponent } from './hub-io-view';
import { HUB_VIEW_PAGE_SELECTORS, HubIoViewModel } from './hub-view-page.selectors';

@Component({
    standalone: true,
    selector: 'app-hub-view-page',
    templateUrl: './hub-view-page.component.html',
    styleUrls: [ './hub-view-page.component.scss' ],
    imports: [
        PushPipe,
        LetDirective,
        NgIf,
        NgForOf,
        TranslocoModule,
        HubPropertiesViewComponent,
        HubIoViewComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubViewPageComponent {
    public readonly selectedHub$: Observable<HubModel | undefined> = this.store.select(ROUTER_SELECTORS.selectRouteParam('id')).pipe(
        switchMap((id) => id === undefined ? EMPTY : this.store.select(HUBS_SELECTORS.selectHub(id)))
    );

    public readonly selectedHubStats$: Observable<HubStatsModel | undefined> = this.store.select(ROUTER_SELECTORS.selectRouteParam('id')).pipe(
        switchMap((id) => id === undefined ? EMPTY : this.store.select(HUB_STATS_SELECTORS.selectByHubId(id)))
    );

    public readonly ioFullInfoList$: Observable<HubIoViewModel[]> = this.store.select(ROUTER_SELECTORS.selectRouteParam('id')).pipe(
        switchMap((id) => id === undefined ? EMPTY : this.store.select(HUB_VIEW_PAGE_SELECTORS.selectFullIosInfoForHub(id)))
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
