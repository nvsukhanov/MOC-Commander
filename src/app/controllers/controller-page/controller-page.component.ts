import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { NgIf } from '@angular/common';
import { PushPipe } from '@ngrx/component';
import { MatCardModule } from '@angular/material/card';
import { TranslocoModule } from '@ngneat/transloco';
import { MatIconModule } from '@angular/material/icon';
import { ControllerTypeIconNamePipe, ControllerTypeToL10nKeyPipe, HintComponent, ScreenSizeObserverService } from '@app/shared';

import { CONTROLLER_PAGE_SELECTORS } from './controller-page-selectors';
import { ControllerNamePipe } from '../controller-name.pipe';
import { ControllerSettingsContainerComponent } from './controller-settings-container';

@Component({
    standalone: true,
    selector: 'app-controller-page',
    templateUrl: './controller-page.component.html',
    styleUrls: [ './controller-page.component.scss' ],
    imports: [
        NgIf,
        PushPipe,
        MatCardModule,
        HintComponent,
        TranslocoModule,
        ControllerNamePipe,
        ControllerSettingsContainerComponent,
        MatIconModule,
        ControllerTypeIconNamePipe,
        ControllerTypeToL10nKeyPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControllerPageComponent {
    public readonly viewModel$ = this.store.select(CONTROLLER_PAGE_SELECTORS.selectViewModel);

    public readonly isSmallScreen$ = this.screenSizeObserver.isSmallScreen$;

    constructor(
        private readonly store: Store,
        private readonly screenSizeObserver: ScreenSizeObserverService
    ) {
    }
}
