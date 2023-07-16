import { ChangeDetectionStrategy, Component, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { Observable, Subscription, map, of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { LetDirective, PushPipe } from '@ngrx/component';
import { NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { CONTROLLER_INPUT_ACTIONS, CONTROL_SCHEME_ACTIONS, CONTROL_SCHEME_SELECTORS, ControlSchemeModel, ROUTER_SELECTORS, } from '@app/store';

import { EllipsisTitleDirective, FeatureToolbarService } from '@app/shared';
import { ControlSchemeViewIoListComponent } from './control-scheme-view-io-list';
import { RoutesBuilderService } from '../../routing';
import { CONTROL_SCHEME_VIEW_SELECTORS, ControlSchemeViewTreeNode } from './control-scheme-view.selectors';

@Component({
    standalone: true,
    selector: 'app-control-scheme-view',
    templateUrl: './control-scheme-view.component.html',
    styleUrls: [ './control-scheme-view.component.scss' ],
    imports: [
        PushPipe,
        TranslocoModule,
        NgIf,
        MatCardModule,
        MatButtonModule,
        LetDirective,
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
    public readonly selectedScheme$: Observable<ControlSchemeModel | undefined> = this.store.select(ROUTER_SELECTORS.selectCurrentlyViewedSchemeId).pipe(
        switchMap((id) => id === null ? of(undefined) : this.store.select(CONTROL_SCHEME_SELECTORS.selectScheme(id))),
    );

    public readonly canRunScheme$: Observable<boolean> = this.store.select(ROUTER_SELECTORS.selectCurrentlyViewedSchemeId).pipe(
        switchMap((id) => id === null
                          ? of(false)
                          : this.store.select(CONTROL_SCHEME_VIEW_SELECTORS.canRunScheme(id))),
    );

    public readonly editSchemeRoute$ = this.store.select(ROUTER_SELECTORS.selectCurrentlyViewedSchemeId).pipe(
        map((id) => id === null ? [] : this.routesBuilderService.controlSchemeEdit(id)),
    );

    public readonly isCurrentControlSchemeRunning$ = this.store.select(CONTROL_SCHEME_VIEW_SELECTORS.isCurrentControlSchemeRunning);

    public readonly schemeViewTree$: Observable<ControlSchemeViewTreeNode[]> = this.store.select(ROUTER_SELECTORS.selectCurrentlyViewedSchemeId).pipe(
        switchMap((id) => id === null
                          ? of([])
                          : this.store.select(CONTROL_SCHEME_VIEW_SELECTORS.schemeViewTree(id))
        )
    );

    private sub?: Subscription;

    private isCapturingInput = false;

    constructor(
        private readonly store: Store,
        private readonly featureToolbarService: FeatureToolbarService,
        private readonly routesBuilderService: RoutesBuilderService,
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
        this.stopRunningScheme();
        this.sub?.unsubscribe();
        this.featureToolbarService.clearConfig();
    }

    public runScheme(schemeId: string): void {
        this.startControllerInputCapture();
        this.store.dispatch(CONTROL_SCHEME_ACTIONS.startScheme({ schemeId }));
    }

    public stopRunningScheme(): void {
        this.stopControllerInputCapture();
        this.store.dispatch(CONTROL_SCHEME_ACTIONS.stopScheme());
    }

    private startControllerInputCapture(): void {
        if (!this.isCapturingInput) {
            this.store.dispatch(CONTROLLER_INPUT_ACTIONS.requestInputCapture());
            this.isCapturingInput = true;
        }
    }

    private stopControllerInputCapture(): void {
        if (this.isCapturingInput) {
            this.store.dispatch(CONTROLLER_INPUT_ACTIONS.releaseInputCapture());
            this.isCapturingInput = false;
        }
    }
}
