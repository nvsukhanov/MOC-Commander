import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { LetDirective } from '@ngrx/component';
import { NgForOf, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Observable } from 'rxjs';
import { TitleService } from '@app/shared-misc';
import { ConfirmationDialogModule, ConfirmationDialogService, HintComponent, HubInlineViewComponent } from '@app/shared-ui';
import { HUBS_ACTIONS } from '@app/store';

import { HUBS_LIST_SELECTORS, HubListViewModel } from './hubs-list.selectors';

@Component({
    standalone: true,
    selector: 'feat-hubs-list',
    templateUrl: './hubs-list.component.html',
    styleUrls: [ './hubs-list.component.scss' ],
    imports: [
        TranslocoPipe,
        LetDirective,
        NgIf,
        HubInlineViewComponent,
        NgForOf,
        MatCardModule,
        ConfirmationDialogModule,
        HintComponent
    ],
    providers: [
        TitleService
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubsListComponent implements OnInit {
    public readonly hubsList$: Observable<HubListViewModel> = this.store.select(HUBS_LIST_SELECTORS.selectHubListViewModel);

    constructor(
        private readonly store: Store,
        private readonly confirmationService: ConfirmationDialogService,
        private readonly translocoService: TranslocoService,
        private readonly titleService: TitleService
    ) {
    }

    public ngOnInit(): void {
        this.titleService.setTitle$(this.translocoService.selectTranslate('pageTitle.hubList'));
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
