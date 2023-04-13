import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { GAMEPAD_ACTIONS } from '../../store';
import { LetModule, PushModule } from '@ngrx/component';
import { TranslocoModule } from '@ngneat/transloco';
import { ControllersListComponent } from '../../controllers-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { HubsListComponent } from '../../hubs-list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ControlSchemeListComponent } from '../../control-schemes-list';

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
        MatToolbarModule,
        RouterOutlet,
        HubsListComponent,
        MatSidenavModule,
        ControlSchemeListComponent,
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
