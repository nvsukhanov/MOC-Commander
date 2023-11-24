import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { LetDirective, PushPipe } from '@ngrx/component';
import { filter, switchMap, take } from 'rxjs';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { Router } from '@angular/router';
import { RoutesBuilderService, TitleService } from '@app/shared-misc';
import { HintComponent } from '@app/shared-ui';
import { HUBS_ACTIONS, HubModel, ROUTER_SELECTORS, attachedIosIdFn } from '@app/store';

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
    providers: [
        TitleService
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubViewPageComponent implements OnInit {
    public readonly selectedHub$ = this.store.select(HUB_VIEW_PAGE_SELECTORS.selectCurrentlyViewedHubModel);

    public readonly selectedHubRuntimeData$ = this.store.select(HUB_VIEW_PAGE_SELECTORS.selectCurrentlyViewedHubRuntimeData);

    public readonly ioFullInfoList$ = this.store.select(HUB_VIEW_PAGE_SELECTORS.selectCurrentlyViewedHubIoFullInfo);

    constructor(
        private readonly store: Store,
        private readonly router: Router,
        private readonly routesBuilderService: RoutesBuilderService,
        private readonly titleService: TitleService,
        private readonly translocoService: TranslocoService
    ) {
    }

    public ngOnInit(): void {
        const title$ = this.selectedHub$.pipe(
            filter((hub): hub is HubModel => !!hub),
            switchMap((hub) => this.translocoService.selectTranslate('pageTitle.hubView', { hubName: hub.name }))
        );
        this.titleService.setTitle$(title$);
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
