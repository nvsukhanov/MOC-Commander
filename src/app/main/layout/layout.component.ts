import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { GAMEPAD_ACTIONS } from '../../store';
import { LetModule, PushModule } from '@ngrx/component';
import { TranslocoModule } from '@ngneat/transloco';
import { ControllersListComponent } from '../../controllers/controllers-list';
import { RouterOutlet } from '@angular/router';
import { HubsListComponent } from '../../hubs/hubs-list';
import { ControlSchemeListComponent } from '../../control-schemes/control-scheme-list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { NgIf } from '@angular/common';
import { NavMenuComponent } from '../nav-menu/nav-menu.component';

@Component({
    standalone: true,
    selector: 'app-root',
    templateUrl: './layout.component.html',
    styleUrls: [ './layout.component.scss' ],
    imports: [
        PushModule,
        LetModule,
        TranslocoModule,
        ControllersListComponent,
        RouterOutlet,
        HubsListComponent,
        ControlSchemeListComponent,
        MatTabsModule,
        MatToolbarModule,
        MatButtonModule,
        MatBadgeModule,
        NgIf,
        NavMenuComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements OnInit {
    constructor(
        private readonly store: Store
    ) {
    }

    public ngOnInit(): void {
        this.store.dispatch(GAMEPAD_ACTIONS.listenGamepadConnected());
    }
}
