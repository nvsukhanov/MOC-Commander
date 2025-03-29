import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, map, of, switchMap, take } from 'rxjs';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Router, RouterLink } from '@angular/router';
import { MatAnchor, MatButton } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { RoutesBuilderService, TitleService } from '@app/shared-misc';
import { BreadcrumbsService, FeatureToolbarControlsDirective, HintComponent } from '@app/shared-components';
import { HUBS_ACTIONS, HubModel, ROUTER_SELECTORS, attachedIosIdFn } from '@app/store';

import { HubPropertiesViewComponent } from './hub-properties-view';
import { HubIoViewComponent } from './hub-io-view';
import { HUB_VIEW_PAGE_SELECTORS, HubIoViewModel } from './hub-view-page.selectors';

@Component({
  standalone: true,
  selector: 'page-hub-view',
  templateUrl: './hub-view-page.component.html',
  styleUrl: './hub-view-page.component.scss',
  imports: [
    TranslocoPipe,
    HubPropertiesViewComponent,
    HubIoViewComponent,
    HintComponent,
    MatAnchor,
    MatButton,
    RouterLink,
    FeatureToolbarControlsDirective,
    AsyncPipe,
  ],
  providers: [TitleService, BreadcrumbsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubViewPageComponent implements OnInit {
  public readonly selectedHub$ = this.store.select(HUB_VIEW_PAGE_SELECTORS.selectCurrentlyViewedHubModel);

  public readonly selectedHubRuntimeData$ = this.store.select(
    HUB_VIEW_PAGE_SELECTORS.selectCurrentlyViewedHubRuntimeData,
  );

  public readonly ioFullInfoList$ = this.store.select(HUB_VIEW_PAGE_SELECTORS.selectCurrentlyViewedHubIoFullInfo);

  public readonly isHubConnected$ = this.store.select(HUB_VIEW_PAGE_SELECTORS.selectIsCurrentlyViewedHubConnected);

  public readonly hubEditRoute$ = this.selectedHub$.pipe(
    filter((hub): hub is HubModel => !!hub),
    map((hub) => this.routesBuilderService.hubEdit(hub.hubId)),
  );

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly routesBuilderService: RoutesBuilderService,
    private readonly titleService: TitleService,
    private readonly translocoService: TranslocoService,
    private breadcrumbs: BreadcrumbsService,
  ) {
    this.breadcrumbs.setBreadcrumbsDef(
      this.selectedHub$.pipe(
        filter((hub): hub is HubModel => !!hub),
        map((hub) => [
          {
            label$: this.translocoService.selectTranslate('pageTitle.hubsList'),
            route: this.routesBuilderService.hubsList,
          },
          {
            label$: of(hub.name),
            route: this.routesBuilderService.hubView(hub.hubId),
          },
        ]),
      ),
    );
  }

  public ngOnInit(): void {
    const title$ = this.selectedHub$.pipe(
      filter((hub): hub is HubModel => !!hub),
      switchMap((hub) => this.translocoService.selectTranslate('pageTitle.hubView', { hubName: hub.name })),
    );
    this.titleService.setTitle$(title$);
  }

  public disconnectHub(): void {
    this.store
      .select(ROUTER_SELECTORS.selectRouteParam('id'))
      .pipe(take(1))
      .subscribe((id) => {
        if (id === undefined) {
          return;
        }
        this.store.dispatch(HUBS_ACTIONS.userRequestedHubDisconnection({ hubId: id }));
      });
    this.router.navigate(this.routesBuilderService.hubsList);
  }

  public hubIoTrackByFn(index: number, item: HubIoViewModel): string {
    return attachedIosIdFn(item);
  }
}
