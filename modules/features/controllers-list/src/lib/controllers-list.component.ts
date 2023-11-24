import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { Store } from '@ngrx/store';
import { LetDirective, PushPipe } from '@ngrx/component';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ControllerNamePipe, ControllerViewHrefPipe } from '@app/shared-controller';
import { TitleService } from '@app/shared-misc';
import { ConfirmationDialogModule, ConfirmationDialogService, ControllerTypeIconNamePipe, HintComponent } from '@app/shared-ui';
import { CONTROLLERS_ACTIONS, ControllerModel } from '@app/store';
import { ControlSchemeViewUrlPipe } from '@app/shared-control-schemes';

import { CONTROLLERS_LIST_SELECTORS, ControllerListViewModel } from './controllers-list.selectors';

@Component({
    standalone: true,
    selector: 'feat-controllers-list',
    templateUrl: './controllers-list.component.html',
    styleUrls: [ './controllers-list.component.scss' ],
    imports: [
        LetDirective,
        NgIf,
        NgForOf,
        HintComponent,
        TranslocoPipe,
        PushPipe,
        ControllerNamePipe,
        MatCardModule,
        ControlSchemeViewUrlPipe,
        MatButtonModule,
        RouterLink,
        ControllerViewHrefPipe,
        ControllerTypeIconNamePipe,
        MatIconModule,
        ConfirmationDialogModule
    ],
    providers: [
        TitleService
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControllersListComponent implements OnInit {
    public readonly controllerListViewModel$: Observable<ControllerListViewModel> = this.store.select(CONTROLLERS_LIST_SELECTORS.viewModel);

    constructor(
        private readonly store: Store,
        private readonly confirmationService: ConfirmationDialogService,
        private readonly translocoService: TranslocoService,
        private readonly titleService: TitleService
    ) {
    }

    public ngOnInit(): void {
        this.titleService.setTitle$(this.translocoService.selectTranslate('pageTitle.controllerList'));
    }

    public controllerTrackById(
        index: number,
        controller: ControllerModel
    ): string {
        return controller.id;
    }

    public forgetController(
        controllerId: string
    ): void {
        this.confirmationService.confirm(
            this.translocoService.selectTranslate('controller.forgetControllerDialogTitle'),
            {
                content$: this.translocoService.selectTranslate('controller.forgetControllerDialogDescription'),
                confirmTitle$: this.translocoService.selectTranslate('controller.forgetControllerDialogConfirmButtonTitle'),
                cancelTitle$: this.translocoService.selectTranslate('controller.forgetControllerDialogCancelButtonTitle')
            }
        ).subscribe((isConfirmed) => {
            if (isConfirmed) {
                this.store.dispatch(CONTROLLERS_ACTIONS.forgetController({ controllerId }));
            }
        });
    }
}