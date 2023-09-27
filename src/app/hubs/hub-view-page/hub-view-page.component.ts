import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { LetDirective, PushPipe } from '@ngrx/component';
import { take } from 'rxjs';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoPipe } from '@ngneat/transloco';
import { Router } from '@angular/router';
import { RoutesBuilderService } from '@app/routing';
import { HUBS_ACTIONS, ROUTER_SELECTORS, attachedIosIdFn, } from '@app/store';
import { HintComponent } from '@app/shared';

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
        TranslocoPipe,
        HubPropertiesViewComponent,
        HubIoViewComponent,
        HintComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubViewPageComponent {
    public readonly selectedHub$ = this.store.select(HUB_VIEW_PAGE_SELECTORS.selectCurrentlyViewedHubModel);

    public readonly selectedHubStats$ = this.store.select(HUB_VIEW_PAGE_SELECTORS.selectCurrentlyViewedHubStats);

    public readonly ioFullInfoList$ = this.store.select(HUB_VIEW_PAGE_SELECTORS.selectCurrentlyViewedHubIoFullInfo);

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
