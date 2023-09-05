import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { Store } from '@ngrx/store';
import { LetDirective } from '@ngrx/component';
import { TranslocoModule } from '@ngneat/transloco';
import { ControllerModel, ControllerSettingsModel } from '@app/store';
import { HintComponent } from '@app/shared';

import { ControllersListItemComponent } from './controllers-list-item';
import { CONTROLLERS_LIST_SELECTORS } from './controllers-list.selectors';

@Component({
    standalone: true,
    selector: 'app-controllers-list-page',
    templateUrl: './controllers-list-page.component.html',
    styleUrls: [ './controllers-list-page.component.scss' ],
    imports: [
        LetDirective,
        NgIf,
        NgForOf,
        ControllersListItemComponent,
        HintComponent,
        TranslocoModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControllersListPageComponent {
    public readonly controllersWithSettings$ = this.store.select(CONTROLLERS_LIST_SELECTORS.viewModel);

    constructor(
        private readonly store: Store
    ) {
    }

    public controllerTrackById(
        index: number,
        controllerWithSettings: { controller: ControllerModel; settings?: ControllerSettingsModel }
    ): string {
        return controllerWithSettings.controller.id;
    }
}
