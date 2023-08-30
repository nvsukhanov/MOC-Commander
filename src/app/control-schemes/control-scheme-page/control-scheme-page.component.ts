import { ChangeDetectionStrategy, Component, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { Observable, Subscription, filter, map, of, switchMap, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { LetDirective, PushPipe } from '@ngrx/component';
import { NgIf } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { CONTROLLER_INPUT_ACTIONS, CONTROL_SCHEME_ACTIONS, CONTROL_SCHEME_SELECTORS, ControlSchemeModel, ROUTER_SELECTORS, } from '@app/store';
import { ConfirmationDialogModule, ConfirmationDialogService, FeatureToolbarControlsDirective, HintComponent } from '@app/shared';

import { RoutesBuilderService } from '../../routing';
import { CONTROL_SCHEME_VIEW_SELECTORS } from './control-scheme-view.selectors';
import { ControlSchemeViewIoListComponent } from './control-scheme-view-io-list';
import { ControlSchemeGeneralInfoComponent } from './control-scheme-general-info';
import { ControlSchemeViewTreeNode } from './types';

@Component({
    standalone: true,
    selector: 'app-control-scheme-page',
    templateUrl: './control-scheme-page.component.html',
    styleUrls: [ './control-scheme-page.component.scss' ],
    imports: [
        PushPipe,
        TranslocoModule,
        NgIf,
        MatCardModule,
        MatButtonModule,
        LetDirective,
        ControlSchemeViewIoListComponent,
        ControlSchemeGeneralInfoComponent,
        ConfirmationDialogModule,
        HintComponent,
        FeatureToolbarControlsDirective,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemePageComponent implements OnDestroy {
    public readonly selectedScheme$: Observable<ControlSchemeModel | undefined> = this.store.select(ROUTER_SELECTORS.selectCurrentlyViewedSchemeName).pipe(
        switchMap((id) => id === null ? of(undefined) : this.store.select(CONTROL_SCHEME_SELECTORS.selectScheme(id))),
    );

    public readonly canRunScheme$: Observable<boolean> = this.store.select(ROUTER_SELECTORS.selectCurrentlyViewedSchemeName).pipe(
        switchMap((id) => id === null
                          ? of(false)
                          : this.store.select(CONTROL_SCHEME_VIEW_SELECTORS.canRunScheme(id))),
    );

    public readonly isCurrentControlSchemeRunning$ = this.store.select(CONTROL_SCHEME_VIEW_SELECTORS.isCurrentControlSchemeRunning);

    public readonly schemeViewTree$: Observable<ControlSchemeViewTreeNode[]> = this.store.select(ROUTER_SELECTORS.selectCurrentlyViewedSchemeName).pipe(
        switchMap((id) => id === null
                          ? of([])
                          : this.store.select(CONTROL_SCHEME_VIEW_SELECTORS.schemeViewTree(id))
        )
    );

    public readonly canCreateBinding$: Observable<boolean> = this.store.select(CONTROL_SCHEME_VIEW_SELECTORS.canCreateBinding);

    private sub?: Subscription;

    private isCapturingInput = false;

    constructor(
        private readonly store: Store,
        private readonly routesBuilderService: RoutesBuilderService,
        private readonly router: Router,
        private readonly confirmationDialogService: ConfirmationDialogService,
        private readonly transloco: TranslocoService
    ) {
    }

    @ViewChild('controlsTemplate', { static: false, read: TemplateRef })
    public set controlsTemplate(controls: TemplateRef<unknown> | null) {
        this.sub?.unsubscribe();
        if (!controls) {
            return;
        }
    }

    public ngOnDestroy(): void {
        this.stopRunningScheme();
        this.sub?.unsubscribe();
    }

    public runScheme(name: string): void {
        this.startControllerInputCapture();
        this.store.dispatch(CONTROL_SCHEME_ACTIONS.startScheme({ name }));
    }

    public stopRunningScheme(): void {
        this.stopControllerInputCapture();
        this.store.dispatch(CONTROL_SCHEME_ACTIONS.stopScheme());
    }

    public addBinding(): void {
        this.selectedScheme$.pipe(
            take(1),
            filter((scheme): scheme is ControlSchemeModel => scheme !== undefined),
        ).subscribe((scheme) => {
            this.router.navigate(
                this.routesBuilderService.bindingCreate(scheme.name)
            );
        });
    }

    public onUpdateSchemeName(
        name: string
    ): void {
        this.selectedScheme$.pipe(
            take(1),
            filter((scheme): scheme is ControlSchemeModel => scheme !== undefined),
        ).subscribe((scheme) => {
            this.store.dispatch(CONTROL_SCHEME_ACTIONS.updateControlSchemeName({
                previousName: scheme.name,
                name
            }));
        });
    }

    public onDelete(): void {
        this.selectedScheme$.pipe(
            take(1),
            filter((scheme): scheme is ControlSchemeModel => scheme !== undefined),
            switchMap((scheme) => this.confirmationDialogService.confirm(
                    this.transloco.selectTranslate('controlScheme.deleteSchemeConfirmationTitle', scheme),
                    {
                        content$: this.transloco.selectTranslate('controlScheme.deleteSchemeConfirmationContent'),
                        confirmTitle$: this.transloco.selectTranslate('controlScheme.deleteSchemeConfirmationConfirmButtonTitle'),
                        cancelTitle$: this.transloco.selectTranslate('controlScheme.deleteSchemeConfirmationCancelButtonTitle')
                    }
                ).pipe(
                    map((isConfirmed) => [ scheme, isConfirmed ] as const)
                )
            )
        ).subscribe(([ { name }, isConfirmed ]) => {
            if (isConfirmed) {
                this.router.navigate(this.routesBuilderService.controlSchemesList);
                this.store.dispatch(CONTROL_SCHEME_ACTIONS.deleteControlScheme({ name }));
            }
        });
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
