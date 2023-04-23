import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EMPTY, Observable, switchMap } from 'rxjs';
import {
    CanRunSchemeResult,
    CONTROL_SCHEME_ACTIONS,
    CONTROL_SCHEME_RUNNING_STATE_SELECTORS,
    CONTROL_SCHEME_SELECTORS,
    ControlScheme,
    ROUTER_SELECTORS
} from '../../../store';
import { Store } from '@ngrx/store';
import { LetModule, PushModule } from '@ngrx/component';
import { JsonPipe, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
    standalone: true,
    selector: 'app-control-scheme-view',
    templateUrl: './control-scheme-view.component.html',
    styleUrls: [ './control-scheme-view.component.scss' ],
    imports: [
        PushModule,
        JsonPipe,
        TranslocoModule,
        NgIf,
        MatCardModule,
        MatButtonModule,
        LetModule,
        NgSwitch,
        NgSwitchCase
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeViewComponent {
    public readonly selectedScheme$: Observable<ControlScheme | undefined> = this.store.select(ROUTER_SELECTORS.selectRouteParam('id')).pipe(
        switchMap((id) => id === undefined ? EMPTY : this.store.select(CONTROL_SCHEME_SELECTORS.selectScheme(id))),
    );

    public readonly canRunScheme$: Observable<CanRunSchemeResult> = this.store.select(ROUTER_SELECTORS.selectRouteParam('id')).pipe(
        switchMap((id) => id === undefined ? EMPTY : this.store.select(CONTROL_SCHEME_RUNNING_STATE_SELECTORS.canRunScheme(id))),
    );

    public readonly runningSchemeId$: Observable<string | null> = this.store.select(CONTROL_SCHEME_RUNNING_STATE_SELECTORS.selectRunningSchemeId);

    constructor(
        private readonly store: Store
    ) {
    }

    public runScheme(schemeId: string): void {
        this.store.dispatch(CONTROL_SCHEME_ACTIONS.runScheme({ schemeId }));
    }

    public stopRunningScheme(): void {
        this.store.dispatch(CONTROL_SCHEME_ACTIONS.stopRunning());
    }
}
