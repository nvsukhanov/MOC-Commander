import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { IState } from '../../store';
import { LetModule, PushModule } from '@ngrx/component';
import { TranslocoModule } from '@ngneat/transloco';
import { ControllersListComponent } from '../../controllers-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { HubsListComponent } from '../../hubs-list';
import { MatSidenavModule } from '@angular/material/sidenav';

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
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
    constructor(
        private readonly store: Store<IState>
    ) {
    }
}
