import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EMPTY, Observable, switchMap } from 'rxjs';
import { CONTROL_SCHEME_SELECTORS, ControlScheme, ROUTER_SELECTORS } from '../../store';
import { Store } from '@ngrx/store';
import { PushModule } from '@ngrx/component';
import { JsonPipe } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-control-scheme-view',
    templateUrl: './control-scheme-view.component.html',
    styleUrls: [ './control-scheme-view.component.scss' ],
    imports: [
        PushModule,
        JsonPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeViewComponent {
    public readonly selectedScheme$: Observable<ControlScheme | undefined> = this.store.select(ROUTER_SELECTORS.selectRouteParam('id')).pipe(
        switchMap((id) => id === undefined ? EMPTY : this.store.select(CONTROL_SCHEME_SELECTORS.selectScheme(id))),
    );

    constructor(
        private readonly store: Store
    ) {
    }
}
