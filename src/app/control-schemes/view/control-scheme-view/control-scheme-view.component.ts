import { ChangeDetectionStrategy, Component } from '@angular/core';
import { bufferCount, combineLatest, map, Observable, of, switchMap } from 'rxjs';
import { CONTROL_SCHEME_ACTIONS, CONTROL_SCHEME_SELECTORS, ControlScheme, HUB_PORT_TASKS_SELECTORS, ROUTER_SELECTORS, } from '../../../store';
import { Store } from '@ngrx/store';
import { LetModule, PushModule } from '@ngrx/component';
import { JsonPipe, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { ControlSchemeViewIoListComponent } from '../control-scheme-view-io-list';
import { EllipsisTitleDirective } from '../../../common';
import { RouterLink } from '@angular/router';
import { CONTROL_SCHEME_EDIT_SUBROUTE } from '../../../routes';

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
        NgSwitchCase,
        MatToolbarModule,
        MatExpansionModule,
        MatIconModule,
        ControlSchemeViewIoListComponent,
        EllipsisTitleDirective,
        RouterLink,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeViewComponent {
    public readonly schemeEditSubroute = CONTROL_SCHEME_EDIT_SUBROUTE;

    public readonly selectedScheme$: Observable<ControlScheme | undefined> = this.store.select(ROUTER_SELECTORS.selectCurrentlyViewedSchemeId).pipe(
        switchMap((id) => id === null ? of(undefined) : this.store.select(CONTROL_SCHEME_SELECTORS.selectScheme(id))),
    );

    public readonly canRunScheme$: Observable<boolean> = this.store.select(ROUTER_SELECTORS.selectCurrentlyViewedSchemeId).pipe(
        switchMap((id) => id === null
                          ? of(false)
                          : this.store.select(CONTROL_SCHEME_SELECTORS.canRunScheme(id))),
    );

    public readonly isCurrentControlSchemeRunning$ = this.store.select(CONTROL_SCHEME_SELECTORS.isCurrentControlSchemeRunning);

    public readonly queueLength$ = this.store.select(HUB_PORT_TASKS_SELECTORS.selectQueueLength);

    public readonly maxQueueLength$ = this.store.select(HUB_PORT_TASKS_SELECTORS.selectMaxQueueLength);

    public readonly lastTenTaskAverageExecutionTime$ = this.store.select(HUB_PORT_TASKS_SELECTORS.lastTaskExecutionTime).pipe(
        bufferCount(10, 1),
        // eslint-disable-next-line @ngrx/avoid-mapping-selectors
        map((v) => v.reduce((acc, val) => acc + val, 0) / 10)
    );

    public readonly bindingsWithLatestExecutedTasks$ = this.store.select(ROUTER_SELECTORS.selectCurrentlyViewedSchemeId).pipe(
        switchMap((id) => id === null
                          ? of([])
                          : this.store.select(CONTROL_SCHEME_SELECTORS.selectSchemeIOData(id))
        )
    );

    public readonly totalTasksExecuted$ = this.store.select(HUB_PORT_TASKS_SELECTORS.selectTotalTasksExecuted);

    public composeValidationErrorMessage$: Observable<string> = this.store.select(ROUTER_SELECTORS.selectCurrentlyViewedSchemeId).pipe(
        switchMap((id) => id === null
                          ? of(null)
                          : this.store.select(CONTROL_SCHEME_SELECTORS.validateScheme(id))
        ),
        switchMap((validationResult) => {
            if (validationResult === null) {
                return of('');
            }
            const validationKeys = [
                validationResult.anotherSchemeIsRunning ? 'schemeValidationAnotherSchemeIsRunning' : '',
                validationResult.hubMissing ? 'schemeValidationHubMissing' : '',
                validationResult.ioMissing ? 'schemeValidationIOMissing' : '',
                validationResult.ioCapabilitiesMismatch ? 'schemeValidationIOCapabilitiesMismatch' : '',
                validationResult.gamepadMissing ? 'schemeValidationGamepadMissing' : '',
            ].filter((v) => v !== '');
            if (validationKeys.length === 0) {
                return of('');
            }
            return combineLatest(validationKeys.map((v) => this.translocoService.selectTranslateObject(v))).pipe(
                map((v) => v.join('\r\n'))
            );
        }),
    );

    constructor(
        private readonly store: Store,
        private readonly translocoService: TranslocoService
    ) {
    }

    public runScheme(schemeId: string): void {
        this.store.dispatch(CONTROL_SCHEME_ACTIONS.runScheme({ schemeId }));
    }

    public stopRunningScheme(): void {
        this.store.dispatch(CONTROL_SCHEME_ACTIONS.stopRunning());
    }
}
