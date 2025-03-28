import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { Observable, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { RoutesBuilderService, TitleService } from '@app/shared-misc';
import { BreadcrumbsService, ConfirmationDialogModule, ConfirmationDialogService, HintComponent, HubInlineViewComponent } from '@app/shared-components';
import { HUBS_ACTIONS } from '@app/store';

import { HUBS_LIST_PAGE_SELECTORS, HubListViewModel } from './hubs-list-page.selectors';

@Component({
    standalone: true,
    selector: 'page-hubs-list',
    templateUrl: './hubs-list-page.component.html',
    styleUrl: './hubs-list-page.component.scss',
    imports: [
        TranslocoPipe,
        HubInlineViewComponent,
        MatCardModule,
        ConfirmationDialogModule,
        HintComponent,
        AsyncPipe
    ],
    providers: [
        TitleService,
        BreadcrumbsService
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubsListPageComponent implements OnInit {
    public readonly hubsList$: Observable<HubListViewModel> = this.store.select(HUBS_LIST_PAGE_SELECTORS.selectHubListViewModel);

    constructor(
        private readonly store: Store,
        private readonly confirmationService: ConfirmationDialogService,
        private readonly translocoService: TranslocoService,
        private readonly titleService: TitleService,
        private readonly routeBuilderService: RoutesBuilderService,
        private breadcrumbs: BreadcrumbsService
    ) {
        this.breadcrumbs.setBreadcrumbsDef(of([
            {
                label$: this.translocoService.selectTranslate('pageTitle.hubsList'),
                route: this.routeBuilderService.hubsList
            }
        ]));
    }

    public ngOnInit(): void {
        this.titleService.setTitle$(this.translocoService.selectTranslate('pageTitle.hubsList'));
    }

    public disconnectHub(
        hubId: string
    ): void {
        this.store.dispatch(HUBS_ACTIONS.userRequestedHubDisconnection({ hubId }));
    }

    public forgetHub(
        hubId: string
    ): void {
        this.confirmationService.confirm(
            this.translocoService.selectTranslate('hub.forgerHubNotificationConfirmationTitle'),
            {
                content$: this.translocoService.selectTranslate('hub.forgerHubNotificationConfirmationContent'),
                confirmTitle$: this.translocoService.selectTranslate('hub.forgerHubNotificationConfirmationConfirmButtonTitle'),
                cancelTitle$: this.translocoService.selectTranslate('hub.forgerHubNotificationConfirmationCancelButtonTitle')
            }
        ).subscribe((isConfirmed) => {
            if (isConfirmed) {
                this.store.dispatch(HUBS_ACTIONS.forgetHub({ hubId }));
            }
        });
    }
}
