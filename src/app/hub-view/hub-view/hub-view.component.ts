import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HUBS_SELECTORS, ROUTER_SELECTORS } from '../../store';
import { Store } from '@ngrx/store';
import { PushModule } from '@ngrx/component';
import { EMPTY, switchMap } from 'rxjs';
import { JsonPipe } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-hub-view',
    templateUrl: './hub-view.component.html',
    styleUrls: [ './hub-view.component.scss' ],
    imports: [
        PushModule,
        JsonPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubViewComponent {
    public readonly selectedHub$ = this.store.select(ROUTER_SELECTORS.selectRouteParam('id')).pipe(
        switchMap((id) => id === undefined ? EMPTY : this.store.select(HUBS_SELECTORS.selectHub(id)))
    );

    constructor(
        private readonly store: Store
    ) {
    }
}
