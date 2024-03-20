import { ChangeDetectionStrategy, Component, Inject, Signal, computed } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDivider } from '@angular/material/divider';
import { TranslocoPipe } from '@ngneat/transloco';

import { RunBlockersListComponent, SchemeRunBlocker } from './run-blockers';
import { CONTROL_SCHEME_PAGE_SELECTORS } from '../control-scheme-page.selectors';
import { CONTROL_SCHEME_RUN_WIDGET_BLOCKERS_CHECKER, IControlSchemeRunWidgetBlockersChecker } from '../widgets';

@Component({
    standalone: true,
    selector: 'page-control-scheme-view-issues-section',
    templateUrl: './issues-section.component.html',
    styleUrls: [ './issues-section.component.scss' ],
    imports: [
        MatDivider,
        RunBlockersListComponent,
        TranslocoPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IssuesSectionComponent {
    public readonly schemeRunBlockers: Signal<SchemeRunBlocker[]> = computed(() => {
        const currentBlockers = this.store.selectSignal(
            CONTROL_SCHEME_PAGE_SELECTORS.selectSchemeRunBlockers(this.controlSchemeStartWidgetCheckService)
        )();
        return currentBlockers.filter((blocker) => !this.hiddenSchemeRunBlockers.has(blocker));
    });

    private readonly hiddenSchemeRunBlockers: ReadonlySet<SchemeRunBlocker> = new Set([
        SchemeRunBlocker.AlreadyRunning
    ]);

    constructor(
        private readonly store: Store,
        @Inject(CONTROL_SCHEME_RUN_WIDGET_BLOCKERS_CHECKER) private readonly controlSchemeStartWidgetCheckService: IControlSchemeRunWidgetBlockersChecker,
    ) {
    }
}
