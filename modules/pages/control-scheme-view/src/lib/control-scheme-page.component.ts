import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Observable, Subscription, filter, map, of, switchMap, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { concatLatestFrom } from '@ngrx/effects';
import { AsyncPipe } from '@angular/common';
import { ISchemeRunnerComponent, RoutesBuilderService, ScreenSizeObserverService, TitleService } from '@app/shared-misc';
import { BreadcrumbsService, ConfirmationDialogModule, ConfirmationDialogService, FeatureToolbarControlsDirective, HintComponent } from '@app/shared-ui';
import { CONTROLLER_INPUT_ACTIONS, CONTROL_SCHEME_ACTIONS, ControlSchemeModel, ROUTER_SELECTORS, WidgetConfigModel } from '@app/store';
import { ExportControlSchemeDialogComponent, ExportControlSchemeDialogData } from '@app/shared-control-schemes';

import { ControlSchemeViewTreeNode, SchemeRunBlocker } from './types';
import { ControlSchemeRunBlockersL10nPipe } from './control-scheme-run-blockers-l10n.pipe';
import { CONTROL_SCHEME_PAGE_SELECTORS } from './control-scheme-page.selectors';
import { ControlSchemeViewIoListComponent } from './control-scheme-view-io-list';
import { ControlSchemeGeneralInfoComponent } from './control-scheme-general-info';
import { ControlSchemePageCompactToolbarControlsComponent } from './compact-toolbar-controls';
import { ControlSchemePageFullToolbarControlsComponent } from './full-toolbar-controls';
import {
    AddWidgetDialogComponent,
    AddWidgetDialogViewModel,
    CONTROL_SCHEME_RUN_WIDGET_BLOCKERS_CHECKER,
    CONTROL_SCHEME_WIDGET_CONFIG_FACTORY,
    ControlSchemeWidgetsGridComponent,
    EditWidgetSettingsDialogComponent,
    IControlSchemeRunWidgetBlockersChecker,
    IControlSchemeWidgetConfigFactory,
    ReorderWidgetDialogComponent
} from './widgets';

@Component({
    standalone: true,
    selector: 'page-control-scheme-view',
    templateUrl: './control-scheme-page.component.html',
    styleUrls: [ './control-scheme-page.component.scss' ],
    imports: [
        TranslocoPipe,
        MatCardModule,
        ControlSchemeViewIoListComponent,
        ControlSchemeGeneralInfoComponent,
        ConfirmationDialogModule,
        HintComponent,
        FeatureToolbarControlsDirective,
        ControlSchemePageCompactToolbarControlsComponent,
        ControlSchemePageFullToolbarControlsComponent,
        MatDialogModule,
        MatIconModule,
        ControlSchemeRunBlockersL10nPipe,
        ControlSchemeWidgetsGridComponent,
        AsyncPipe
    ],
    providers: [
        TitleService,
        BreadcrumbsService
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemePageComponent implements OnInit, OnDestroy, ISchemeRunnerComponent {
    public readonly selectedScheme$: Observable<ControlSchemeModel | undefined> = this.store.select(CONTROL_SCHEME_PAGE_SELECTORS.selectCurrentlyViewedScheme);

    public readonly schemeRunBlockers$: Observable<SchemeRunBlocker[]> = this.store.select(
        CONTROL_SCHEME_PAGE_SELECTORS.selectSchemeRunBlockers(this.controlSchemeStartWidgetCheckService)
    ).pipe(
        map((blockers) => blockers.filter((blocker) => !this.hiddenSchemeRunBlockers.has(blocker)))
    );

    public readonly canRunScheme$: Observable<boolean> = this.store.select(
        CONTROL_SCHEME_PAGE_SELECTORS.canRunViewedScheme(this.controlSchemeStartWidgetCheckService)
    );

    public readonly canDeleteScheme$: Observable<boolean> = this.store.select(CONTROL_SCHEME_PAGE_SELECTORS.canDeleteViewedScheme);

    public readonly isCurrentControlSchemeRunning$ = this.store.select(CONTROL_SCHEME_PAGE_SELECTORS.isCurrentControlSchemeRunning);

    public readonly schemeViewTree$: Observable<ControlSchemeViewTreeNode[]> = this.store.select(CONTROL_SCHEME_PAGE_SELECTORS.schemeViewTree);

    public readonly canExportScheme$: Observable<boolean> = this.store.select(CONTROL_SCHEME_PAGE_SELECTORS.canExportViewedScheme);

    public readonly canCreateBinding$: Observable<boolean> = this.store.select(CONTROL_SCHEME_PAGE_SELECTORS.canCreateBinding);

    public readonly isSmallScreen$: Observable<boolean> = this.screenSizeObserverService.isSmallScreen$;

    public readonly canAddWidgets$: Observable<boolean>;

    public readonly canReorderWidgets$: Observable<boolean> = this.store.select(CONTROL_SCHEME_PAGE_SELECTORS.canReorderWidgets);

    public readonly canDeleteOrEditWidgets$ = this.store.select(CONTROL_SCHEME_PAGE_SELECTORS.canDeleteOrEditWidgets);

    public readonly canRenameScheme$: Observable<boolean> = this.store.select(CONTROL_SCHEME_PAGE_SELECTORS.canRenameScheme);

    public readonly isSchemeRunning: Observable<boolean> = this.store.select(CONTROL_SCHEME_PAGE_SELECTORS.isCurrentControlSchemeRunning);

    private addableWidgetConfigs$: Observable<WidgetConfigModel[]> = this.selectedScheme$.pipe(
        take(1),
        filter((scheme): scheme is ControlSchemeModel => scheme !== undefined),
        switchMap((scheme) => this.store.select(CONTROL_SCHEME_PAGE_SELECTORS.addableWidgetConfigFactoryBaseData(scheme.name))),
        map((addableWidgetData) => {
            return this.widgetDefaultConfigFactory.createConfigs(
                addableWidgetData.ios,
                addableWidgetData.portModes,
                addableWidgetData.portModesInfo
            );
        })
    );

    private sub?: Subscription;

    private isCapturingInput = false;

    private readonly hiddenSchemeRunBlockers: ReadonlySet<SchemeRunBlocker> = new Set([
        SchemeRunBlocker.AlreadyRunning
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
        @Inject(CONTROL_SCHEME_WIDGET_CONFIG_FACTORY) private readonly widgetDefaultConfigFactory: IControlSchemeWidgetConfigFactory,
        @Inject(CONTROL_SCHEME_RUN_WIDGET_BLOCKERS_CHECKER) private readonly controlSchemeStartWidgetCheckService: IControlSchemeRunWidgetBlockersChecker,
        private breadcrumbs: BreadcrumbsService
    ) {
        this.canAddWidgets$ = this.addableWidgetConfigs$.pipe(
            map((configs) => configs.length > 0)
        );
        this.breadcrumbs.setBreadcrumbsDef(
            this.selectedScheme$.pipe(
                filter((r): r is ControlSchemeModel => r !== undefined),
                map((scheme) => [
                    {
                        label$: this.transloco.selectTranslate('pageTitle.controlSchemesList'),
                        route: this.routesBuilderService.controlSchemesList
                    },
                    {
                        label$: of(scheme.name),
                        route: this.routesBuilderService.controlSchemeView(scheme.name)
                    }
                ])
            )
        );
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
            filter((scheme): scheme is ControlSchemeModel => scheme !== undefined)
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
            filter((scheme): scheme is ControlSchemeModel => scheme !== undefined)
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
            concatLatestFrom(() => this.addableWidgetConfigs$),
            switchMap(([ scheme, availableWidgetsConfig ]) => {
                return this.dialog.open<AddWidgetDialogComponent, AddWidgetDialogViewModel, Omit<WidgetConfigModel, 'id'> | undefined>(
                    AddWidgetDialogComponent,
                    {
                        data: {
                            controlSchemeName: scheme.name,
                            addableWidgetConfigs: availableWidgetsConfig
                        }
                    }
                ).afterClosed().pipe(
                    map((widgetConfig) => ({ schemeName: scheme.name, widgetConfig }))
                );
            })
        ).subscribe(({ schemeName, widgetConfig }) => {
            if (widgetConfig) {
                this.store.dispatch(CONTROL_SCHEME_ACTIONS.addWidget({ schemeName, widgetConfig }));
            }
        });
    }

    public onEditWidget(
        widgetIndex: number
    ): void {
        this.selectedScheme$.pipe(
            take(1),
            filter((scheme): scheme is ControlSchemeModel => scheme !== undefined),
            switchMap((data) => this.dialog.open<EditWidgetSettingsDialogComponent, WidgetConfigModel, WidgetConfigModel | undefined>(
                EditWidgetSettingsDialogComponent,
                { data: data.widgets[widgetIndex] }
            ).afterClosed().pipe(
                map((widgetConfig) => ({ schemeName: data.name, widgetConfig }))
            ))
        ).subscribe(({ schemeName, widgetConfig }) => {
            if (widgetConfig) {
                this.store.dispatch(CONTROL_SCHEME_ACTIONS.updateWidget({ schemeName, widgetConfig }));
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

    public onReorderWidgets(): void {
        this.selectedScheme$.pipe(
            take(1),
            filter((scheme): scheme is ControlSchemeModel => scheme !== undefined),
            switchMap((scheme) => this.dialog.open<ReorderWidgetDialogComponent, WidgetConfigModel[], WidgetConfigModel[]>(
                ReorderWidgetDialogComponent,
                { data: scheme.widgets }
            ).afterClosed().pipe(
                map((result) => ({ schemeName: scheme.name, result }))
            ))
        ).subscribe(({ schemeName, result }) => {
            if (result) {
                this.store.dispatch(CONTROL_SCHEME_ACTIONS.reorderWidgets({ schemeName, widgets: result }));
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
