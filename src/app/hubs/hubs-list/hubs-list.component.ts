import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { LetDirective, PushPipe } from '@ngrx/component';
import { NgForOf, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { Observable } from 'rxjs';
import { HUBS_ACTIONS } from '@app/store';

import { ConfirmationDialogModule, ConfirmationDialogService, HubInlineViewComponent } from '@app/shared';
import { HUBS_LIST_SELECTORS, HubListViewModel } from './hubs-list.selectors';

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
        HubInlineViewComponent,
        NgForOf,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatDividerModule,
        ConfirmationDialogModule
    ],
    providers: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubsListComponent {
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
        this.confirmationService.show(
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
