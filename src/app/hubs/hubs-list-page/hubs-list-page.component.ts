import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { LetDirective } from '@ngrx/component';
import { NgForOf, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Observable } from 'rxjs';
import { HUBS_ACTIONS } from '@app/store';
import { ConfirmationDialogModule, ConfirmationDialogService, HintComponent, HubInlineViewComponent } from '@app/shared';

import { HUBS_LIST_SELECTORS, HubListViewModel } from './hubs-list.selectors';

@Component({
    standalone: true,
    selector: 'app-hubs-list-page',
    templateUrl: './hubs-list-page.component.html',
    styleUrls: [ './hubs-list-page.component.scss' ],
    imports: [
        TranslocoModule,
        LetDirective,
        NgIf,
        HubInlineViewComponent,
        NgForOf,
        MatCardModule,
        ConfirmationDialogModule,
        HintComponent
    ],
    providers: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubsListPageComponent {
    public readonly hubsList$: Observable<HubListViewModel> = this.store.select(HUBS_LIST_SELECTORS.selectHubListViewModel);

    constructor(
        private readonly store: Store,
        private readonly confirmationService: ConfirmationDialogService,
        private readonly translocoService: TranslocoService
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
