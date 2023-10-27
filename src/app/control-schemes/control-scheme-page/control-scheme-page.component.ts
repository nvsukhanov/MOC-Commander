import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Observable, Subscription, filter, map, of, switchMap, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { LetDirective, PushPipe } from '@ngrx/component';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RoutesBuilderService } from '@app/routing';
import { CONTROLLER_INPUT_ACTIONS, CONTROL_SCHEME_ACTIONS, ControlSchemeModel, ROUTER_SELECTORS, WidgetConfigModel, } from '@app/store';
import {
    ConfirmationDialogModule,
    ConfirmationDialogService,
    FeatureToolbarControlsDirective,
    HintComponent,
    ScreenSizeObserverService,
    TitleService,
} from '@app/shared';

import { CONTROL_SCHEME_PAGE_SELECTORS, VoltageDataProviderService } from './dal';
import { ControlSchemeViewTreeNode, SchemeRunBlocker } from './types';
import { ExportControlSchemeDialogComponent, ExportControlSchemeDialogData, } from '../common';
import {
    AddWidgetDialogComponent,
    CONTROL_SCHEME_WIDGET_COMPONENT_RESOLVER,
    ControlSchemeGeneralInfoComponent,
    ControlSchemePageCompactToolbarComponent,
    ControlSchemePageFullToolbarComponent,
    ControlSchemeViewIoListComponent,
    ControlSchemeWidgetComponentResolverService,
    ControlSchemeWidgetsGridComponent,
    VOLTAGE_WIDGET_DATA_PROVIDER
} from './components';
import { ControlSchemeRunBlockersL10nPipe } from './control-scheme-run-blockers-l10n.pipe';
import { AddWidgetDialogViewModelProvider } from './dal/add-widget-dialog-view-model-provider.service';
import { AddWidgetDialogViewModel } from './components/add-widget-dialog/add-widget-dialog-view-model';

@Component({
    standalone: true,
    selector: 'app-control-scheme-page',
    templateUrl: './control-scheme-page.component.html',
    styleUrls: [ './control-scheme-page.component.scss' ],
    imports: [
        PushPipe,
        TranslocoPipe,
        NgIf,
        MatCardModule,
        ControlSchemeViewIoListComponent,
        ControlSchemeGeneralInfoComponent,
        ConfirmationDialogModule,
        HintComponent,
        FeatureToolbarControlsDirective,
        ControlSchemePageCompactToolbarComponent,
        ControlSchemePageFullToolbarComponent,
        MatDialogModule,
        NgForOf,
        MatIconModule,
        ControlSchemeRunBlockersL10nPipe,
        LetDirective,
        ControlSchemeWidgetsGridComponent,
    ],
    providers: [
        TitleService,
        { provide: CONTROL_SCHEME_WIDGET_COMPONENT_RESOLVER, useClass: ControlSchemeWidgetComponentResolverService },
        { provide: VOLTAGE_WIDGET_DATA_PROVIDER, useClass: VoltageDataProviderService },
        AddWidgetDialogViewModelProvider
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemePageComponent implements OnInit, OnDestroy {
    public readonly selectedScheme$: Observable<ControlSchemeModel | undefined> = this.store.select(CONTROL_SCHEME_PAGE_SELECTORS.selectCurrentlyViewedScheme);

    public readonly schemeRunBlockers$: Observable<SchemeRunBlocker[]> = this.store.select(CONTROL_SCHEME_PAGE_SELECTORS.selectSchemeRunBlockers).pipe(
        map((blockers) => blockers.filter((blocker) => !this.hiddenSchemeRunBlockers.has(blocker)))
    );

    public readonly canRunScheme$: Observable<boolean> = this.store.select(CONTROL_SCHEME_PAGE_SELECTORS.canRunViewedScheme);

    public readonly isCurrentControlSchemeRunning$ = this.store.select(CONTROL_SCHEME_PAGE_SELECTORS.isCurrentControlSchemeRunning);

    public readonly schemeViewTree$: Observable<ControlSchemeViewTreeNode[]> = this.store.select(CONTROL_SCHEME_PAGE_SELECTORS.schemeViewTree);

    public readonly canExportScheme$: Observable<boolean> = this.store.select(CONTROL_SCHEME_PAGE_SELECTORS.canExportViewedScheme);

    public readonly canCreateBinding$: Observable<boolean> = this.store.select(CONTROL_SCHEME_PAGE_SELECTORS.canCreateBinding);

    public readonly isSmallScreen$: Observable<boolean> = this.screenSizeObserverService.isSmallScreen$;

    public readonly canAddWidgets$ = this.selectedScheme$.pipe(
        switchMap((scheme) => scheme ? this.addWidgetDialogViewModelProvider.getAddWidgetDialogViewModel(scheme.name) : of(null)),
        map((r) => r && r.widgets.length)
    );

    public readonly canDeleteOrEditWidgets$ = this.store.select(CONTROL_SCHEME_PAGE_SELECTORS.canDeleteOrEditWidgets);

    private sub?: Subscription;

    private isCapturingInput = false;

    private readonly hiddenSchemeRunBlockers: ReadonlySet<SchemeRunBlocker> = new Set([
        SchemeRunBlocker.AlreadyRunning,
    ]);

    constructor(
        private readonly store: Store,
        private readonly routesBuilderService: RoutesBuilderService,
        private readonly router: Router,
        private readonly confirmationDialogService: ConfirmationDialogService,
        private readonly transloco: TranslocoService,
        private readonly dialog: MatDialog,
        private readonly screenSizeObserverService: ScreenSizeObserverService,
        private readonly titleService: TitleService,
        private readonly addWidgetDialogViewModelProvider: AddWidgetDialogViewModelProvider
    ) {
    }

    @ViewChild('controlsTemplate', { static: false, read: TemplateRef })
    public set controlsTemplate(controls: TemplateRef<unknown> | null) {
        this.sub?.unsubscribe();
        if (!controls) {
            return;
        }
    }

    public ngOnInit(): void {
        this.titleService.setTitle$(
            this.store.select(ROUTER_SELECTORS.selectCurrentlyViewedSchemeName).pipe(
                switchMap((controlSchemeName) => this.transloco.selectTranslate('pageTitle.controlSchemeView', { controlSchemeName }))
            )
        );
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

    public onAddWidget(): void {
        this.selectedScheme$.pipe(
            take(1),
            filter((scheme): scheme is ControlSchemeModel => scheme !== undefined),
            switchMap((scheme) => this.addWidgetDialogViewModelProvider.getAddWidgetDialogViewModel(scheme.name)),
            take(1),
            switchMap((data) => this.dialog.open<AddWidgetDialogComponent, AddWidgetDialogViewModel, Omit<WidgetConfigModel, 'id'> | undefined>(
                AddWidgetDialogComponent,
                { data }
            ).afterClosed().pipe(
                map((widgetConfig) => ({ schemeName: data.controlSchemeName, widgetConfig }))
            ))
        ).subscribe(({ schemeName, widgetConfig }) => {
            if (widgetConfig) {
                this.store.dispatch(CONTROL_SCHEME_ACTIONS.addWidget({ schemeName, widgetConfig }));
            }
        });
    }

    public onDeleteWidget(
        widgetIndex: number
    ): void {
        this.selectedScheme$.pipe(
            take(1),
            filter((scheme): scheme is ControlSchemeModel => scheme !== undefined)
        ).subscribe((scheme) => {
            const widgetId = scheme.widgets[widgetIndex].id;
            this.store.dispatch(CONTROL_SCHEME_ACTIONS.deleteWidget({ schemeName: scheme.name, widgetId }));
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
