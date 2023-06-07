import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { LetDirective, PushPipe } from '@ngrx/component';
import { NgForOf, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

import { ConfirmDialogService, HubInlineViewComponent } from '@app/shared';
import { HUBS_ACTIONS, HUBS_SELECTORS } from '../../store';

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
        MatDividerModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubsListComponent implements OnDestroy {
    public readonly connectedHubs$ = this.store.select(HUBS_SELECTORS.selectHubsWithConnectionState);

    constructor(
        private readonly store: Store,
        private readonly confirmDialogService: ConfirmDialogService,
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

    public ngOnDestroy(): void {
        this.confirmDialogService.hide(this);
    }

    public forgetHub(
        hubId: string
    ): void {
        this.confirmDialogService.show(
            this.translocoService.selectTranslate('hub.forgerHubNotificationConfirmationTitle'),
            this,
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
