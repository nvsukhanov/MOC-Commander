import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PushPipe } from '@ngrx/component';
import { ScreenSizeObserverService } from '@app/shared-misc';
import { HUBS_ACTIONS } from '@app/store';

import { CompactNavMenuComponent } from './compact-nav-menu';
import { FullNavMenuComponent } from './full-nav-menu';
import { NAV_MENU_SELECTORS } from './nav-menu.selectors';

@Component({
    standalone: true,
    selector: 'app-nav-menu',
    templateUrl: './nav-menu.component.html',
    styleUrls: [ './nav-menu.component.scss' ],
    imports: [
        PushPipe,
        CompactNavMenuComponent,
        FullNavMenuComponent,
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
