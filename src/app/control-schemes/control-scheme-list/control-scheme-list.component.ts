import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LetModule, PushModule } from '@ngrx/component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { CONTROL_SCHEME_ACTIONS, CONTROL_SCHEME_SELECTORS, ControlScheme } from '../../store';
import { ControlSchemeListItemComponent } from '../control-scheme-list-item';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { CONTROL_SCHEME_CREATE_SUBROUTE, CONTROL_SCHEME_ROUTE } from '../../routes';
import { MatIconModule } from '@angular/material/icon';

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
        MatIconModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeListComponent {
    public readonly controlSchemes$ = this.store.select(CONTROL_SCHEME_SELECTORS.selectSchemesList);

    constructor(
        private readonly store: Store,
        private readonly router: Router
    ) {
    }

    public trackSchemeById(index: number, scheme: ControlScheme): string {
        return scheme.id;
    }

    public onDelete(id: string): void {
        this.store.dispatch(CONTROL_SCHEME_ACTIONS.delete({ id }));
    }

    public onCreate(): void {
        this.router.navigate([ CONTROL_SCHEME_ROUTE, CONTROL_SCHEME_CREATE_SUBROUTE ]);
    }
}
