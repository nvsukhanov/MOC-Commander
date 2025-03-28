import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ScreenSizeObserverService } from '@app/shared-misc';
import { HUBS_ACTIONS } from '@app/store';

import { CompactNavMenuComponent } from './compact-nav-menu';
import { FullNavMenuComponent } from './full-nav-menu';
import { NAV_MENU_SELECTORS } from './nav-menu.selectors';

@Component({
    standalone: true,
    selector: 'app-nav-menu',
    templateUrl: './nav-menu.component.html',
    styleUrl: './nav-menu.component.scss',
    imports: [
        CompactNavMenuComponent,
        FullNavMenuComponent,
        AsyncPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavMenuComponent {
    public readonly navMenuViewModel$ = this.store.select(NAV_MENU_SELECTORS.selectNavMenuViewModel);

    public readonly isSmallScreen$: Observable<boolean>;

    constructor(
        private readonly store: Store,
        screenSizeObserverService: ScreenSizeObserverService,
    ) {
        this.isSmallScreen$ = screenSizeObserverService.isSmallScreen$;
    }

    public onDiscoveryStart(): void {
        this.store.dispatch(HUBS_ACTIONS.startDiscovery());
    }
}
