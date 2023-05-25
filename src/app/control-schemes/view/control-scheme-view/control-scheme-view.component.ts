import { ChangeDetectionStrategy, Component, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { bufferCount, combineLatest, map, Observable, of, Subscription, switchMap } from 'rxjs';
import { CONTROL_SCHEME_ACTIONS, CONTROL_SCHEME_SELECTORS, ControlScheme, HUB_PORT_TASKS_SELECTORS, ROUTER_SELECTORS, } from '../../../store';
import { Store } from '@ngrx/store';
import { LetModule, PushModule } from '@ngrx/component';
import { NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ControlSchemeViewIoListComponent } from '../control-scheme-view-io-list';
import { EllipsisTitleDirective, FeatureToolbarService } from '../../../common';
import { RouterLink } from '@angular/router';
import { ROUTE_PATHS } from '../../../routes';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
    standalone: true,
    selector: 'app-control-scheme-view',
    templateUrl: './control-scheme-view.component.html',
    styleUrls: [ './control-scheme-view.component.scss' ],
    imports: [
        PushModule,
        TranslocoModule,
        NgIf,
        MatCardModule,
        MatButtonModule,
        LetModule,
        NgSwitch,
        NgSwitchCase,
        MatIconModule,
        ControlSchemeViewIoListComponent,
        EllipsisTitleDirective,
        RouterLink,
        MatExpansionModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeViewComponent implements OnDestroy {
    public readonly schemeEditSubroute = ROUTE_PATHS.controlSchemeEditSubroute;

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

    private sub?: Subscription;

    constructor(
        private readonly store: Store,
        private readonly featureToolbarService: FeatureToolbarService,
        private readonly translocoService: TranslocoService,
    ) {
    }

    @ViewChild('controlsTemplate', { static: false, read: TemplateRef })
    public set controlsTemplate(controls: TemplateRef<unknown> | null) {
        this.sub?.unsubscribe();
        if (!controls) {
            return;
        }
        this.sub = this.selectedScheme$.subscribe((scheme) => {
            if (scheme) {
                this.featureToolbarService.setControls(controls);
            } else {
                this.featureToolbarService.clearConfig();
            }

        });
    }

    public ngOnDestroy(): void {
        this.sub?.unsubscribe();
        this.featureToolbarService.clearConfig();
    }

    public runScheme(schemeId: string): void {
        this.store.dispatch(CONTROL_SCHEME_ACTIONS.runScheme({ schemeId }));
    }

    public stopRunningScheme(): void {
        this.store.dispatch(CONTROL_SCHEME_ACTIONS.stopRunning());
    }
}
