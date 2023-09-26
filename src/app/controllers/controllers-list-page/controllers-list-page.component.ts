import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { Store } from '@ngrx/store';
import { LetDirective, PushPipe } from '@ngrx/component';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CONTROLLERS_ACTIONS, ControllerModel } from '@app/store';
import { ConfirmationDialogModule, ConfirmationDialogService, ControllerTypeIconNamePipe, HintComponent } from '@app/shared';

import { CONTROLLERS_LIST_PAGE_SELECTORS, ControllerListViewModel } from './controllers-list-page.selectors';
import { ControllerNamePipe } from '../controller-name.pipe';
import { ControlSchemeViewUrlPipe } from '../../control-schemes/control-scheme-list-page/control-scheme-view-url.pipe';
import { ControllerViewHrefPipe } from '../controller-view-href.pipe';

@Component({
    standalone: true,
    selector: 'app-controllers-list-page',
    templateUrl: './controllers-list-page.component.html',
    styleUrls: [ './controllers-list-page.component.scss' ],
    imports: [
        LetDirective,
        NgIf,
        NgForOf,
        HintComponent,
        TranslocoModule,
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
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControllersListPageComponent {
    public readonly controllerListViewModel$: Observable<ControllerListViewModel> = this.store.select(CONTROLLERS_LIST_PAGE_SELECTORS.viewModel);

    constructor(
        private readonly store: Store,
        private readonly confirmationService: ConfirmationDialogService,
        private readonly translocoService: TranslocoService
    ) {
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