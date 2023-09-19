import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { Store } from '@ngrx/store';
import { LetDirective, PushPipe } from '@ngrx/component';
import { TranslocoModule } from '@ngneat/transloco';
import { Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ControllerModel } from '@app/store';
import { ControllerTypeIconNamePipe, HintComponent } from '@app/shared';

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
        MatIconModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControllersListPageComponent {
    public readonly controllerListViewModel$: Observable<ControllerListViewModel> = this.store.select(CONTROLLERS_LIST_PAGE_SELECTORS.viewModel);

    constructor(
        private readonly store: Store
    ) {
    }

    public controllerTrackById(
        index: number,
        controller: ControllerModel
    ): string {
        return controller.id;
    }
}
