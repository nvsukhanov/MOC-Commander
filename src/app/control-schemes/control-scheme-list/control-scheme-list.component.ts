import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LetModule, PushModule } from '@ngrx/component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { CONTROL_SCHEME_ACTIONS, CONTROL_SCHEME_CONFIGURATION_STATE_SELECTORS, CONTROL_SCHEME_SELECTORS, ControlScheme } from '../../store';
import { ControlSchemeListItemComponent } from '../control-scheme-list-item';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ROUTE_PATHS } from '../../routes';
import { FeatureContentContainerComponent, FeatureToolbarComponent } from '../../common';
import { MatCardModule } from '@angular/material/card';

@Component({
    standalone: true,
    selector: 'app-control-scheme-list',
    templateUrl: './control-scheme-list.component.html',
    styleUrls: [ './control-scheme-list.component.scss' ],
    imports: [
        LetModule,
        MatExpansionModule,
        MatListModule,
        NgForOf,
        NgIf,
        PushModule,
        TranslocoModule,
        ControlSchemeListItemComponent,
        MatButtonModule,
        MatIconModule,
        RouterLink,
        FeatureToolbarComponent,
        FeatureContentContainerComponent,
        MatCardModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeListComponent {
    public readonly controlSchemes$ = this.store.select(CONTROL_SCHEME_SELECTORS.selectSchemesList);

    public readonly canCreateScheme$ = this.store.select(CONTROL_SCHEME_CONFIGURATION_STATE_SELECTORS.canAddBinding);

    public readonly createSchemeRoute = [ '..', ROUTE_PATHS.controlScheme, ROUTE_PATHS.controlSchemeCreateSubroute ];

    constructor(
        private readonly store: Store,
    ) {
    }

    public trackSchemeById(index: number, scheme: ControlScheme): string {
        return scheme.id;
    }

    public onDelete(id: string): void {
        this.store.dispatch(CONTROL_SCHEME_ACTIONS.delete({ id }));
    }
}
