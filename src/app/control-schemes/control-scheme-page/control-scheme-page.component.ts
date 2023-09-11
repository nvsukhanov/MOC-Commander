import { ChangeDetectionStrategy, Component, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { Observable, Subscription, filter, map, of, switchMap, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { PushPipe } from '@ngrx/component';
import { NgIf } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RoutesBuilderService } from '@app/routing';
import { CONTROLLER_INPUT_ACTIONS, CONTROL_SCHEME_ACTIONS, CONTROL_SCHEME_SELECTORS, ControlSchemeModel, ROUTER_SELECTORS, } from '@app/store';
import { ConfirmationDialogModule, ConfirmationDialogService, FeatureToolbarControlsDirective, HintComponent, ScreenSizeObserverService } from '@app/shared';

import { CONTROL_SCHEME_PAGE_SELECTORS } from './control-scheme-page.selectors';
import { ControlSchemeViewIoListComponent } from './control-scheme-view-io-list';
import { ControlSchemeGeneralInfoComponent } from './control-scheme-general-info';
import { ControlSchemeViewTreeNode } from './types';
import { ExportControlSchemeDialogComponent, ExportControlSchemeDialogData } from '../common';
import { ControlSchemePageCompactToolbarComponent } from './compact-toolbar';
import { ControlSchemePageFullToolbarComponent } from './full-toolbar';

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
        ControlSchemeViewIoListComponent,
        ControlSchemeGeneralInfoComponent,
        ConfirmationDialogModule,
        HintComponent,
        FeatureToolbarControlsDirective,
        ControlSchemePageCompactToolbarComponent,
        ControlSchemePageFullToolbarComponent,
        MatDialogModule
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
                          : this.store.select(CONTROL_SCHEME_PAGE_SELECTORS.canRunScheme(id))),
    );

    public readonly isCurrentControlSchemeRunning$ = this.store.select(CONTROL_SCHEME_PAGE_SELECTORS.isCurrentControlSchemeRunning);

    public readonly schemeViewTree$: Observable<ControlSchemeViewTreeNode[]> = this.store.select(ROUTER_SELECTORS.selectCurrentlyViewedSchemeName).pipe(
        switchMap((id) => id === null
                          ? of([])
                          : this.store.select(CONTROL_SCHEME_PAGE_SELECTORS.schemeViewTree(id))
        )
    );

    public readonly canExportScheme$: Observable<boolean> = this.store.select(ROUTER_SELECTORS.selectCurrentlyViewedSchemeName).pipe(
        switchMap((name) => name === null ? of(false) : this.store.select(CONTROL_SCHEME_PAGE_SELECTORS.canExportScheme(name))),
    );

    public readonly canCreateBinding$: Observable<boolean> = this.store.select(CONTROL_SCHEME_PAGE_SELECTORS.canCreateBinding);

    public readonly isSmallScreen$: Observable<boolean> = this.screenSizeObserverService.isSmallScreen$;

    private sub?: Subscription;

    private isCapturingInput = false;

    constructor(
        private readonly store: Store,
        private readonly routesBuilderService: RoutesBuilderService,
        private readonly router: Router,
        private readonly confirmationDialogService: ConfirmationDialogService,
        private readonly transloco: TranslocoService,
        private readonly dialog: MatDialog,
        private readonly screenSizeObserverService: ScreenSizeObserverService
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

    public onExport(
        name: string
    ): void {
        this.dialog.open<ExportControlSchemeDialogComponent, ExportControlSchemeDialogData>(
            ExportControlSchemeDialogComponent,
            { data: { name } }
        );
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
            this.router.navigate(this.routesBuilderService.controlSchemeView(name));
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
