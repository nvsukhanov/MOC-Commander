import { ChangeDetectionStrategy, Component } from '@angular/core';
import { bufferCount, EMPTY, map, max, Observable, switchMap } from 'rxjs';
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
import { HUB_PORT_TASKS_SELECTORS } from '../../../store/selectors/hub-port-tasks.selectors';

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

    public readonly queueLength$ = this.store.select(HUB_PORT_TASKS_SELECTORS.selectQueueLength);

    public readonly maxQueueLength$ = this.store.select(HUB_PORT_TASKS_SELECTORS.selectQueueLength).pipe(
        max()
    );

    public readonly maxTaskExecutionTime$ = this.store.select(HUB_PORT_TASKS_SELECTORS.lastTaskExecutionTime).pipe(
        max()
    );

    public readonly lastFiveTaskAverageExecutionTime$ = this.store.select(HUB_PORT_TASKS_SELECTORS.lastTaskExecutionTime).pipe(
        bufferCount(5, 1),
        // eslint-disable-next-line @ngrx/avoid-mapping-selectors
        map((v) => v.reduce((acc, val) => acc + val, 0) / 5)
    );

    public readonly totalTasksExecuted$ = this.store.select(HUB_PORT_TASKS_SELECTORS.selectTotalTasksExecuted);

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

    protected readonly max = max;
}
