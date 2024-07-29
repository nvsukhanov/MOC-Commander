import { ChangeDetectionStrategy, Component, Inject, OnDestroy, computed } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription, map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { CONTROL_SCHEME_ACTIONS, WidgetConfigModel } from '@app/store';

import { CONTROL_SCHEME_PAGE_SELECTORS } from '../control-scheme-page.selectors';
import { CONTROL_SCHEME_WIDGET_CONFIG_FACTORY, IControlSchemeWidgetConfigFactory } from './i-control-scheme-widget-config-factory';
import { AddWidgetDialogComponent, AddWidgetDialogViewModel } from './add-widget-dialog';
import { ControlSchemeWidgetsGridComponent } from './widgets-grid';
import { EditWidgetSettingsDialogComponent } from './edit-widget-settings-dialog';
import { ReorderWidgetDialogComponent } from './reorder-widgets-dialog';
import { WIDGETS_SECTION_SELECTORS } from './widgets-section.selectors';

@Component({
    standalone: true,
    selector: 'page-control-scheme-view-widgets',
    templateUrl: './widgets-section.component.html',
    styleUrls: [ './widgets-section.component.scss' ],
    imports: [
        MatIconButton,
        ControlSchemeWidgetsGridComponent,
        MatIcon,
        TranslocoPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetsSectionComponent implements OnDestroy {
    public readonly isSchemeRunning = this.store.selectSignal(CONTROL_SCHEME_PAGE_SELECTORS.isCurrentControlSchemeRunning);

    public readonly canReorderWidgets = this.store.selectSignal(WIDGETS_SECTION_SELECTORS.canReorderWidgets);

    public readonly canDeleteOrEditWidgets = this.store.selectSignal(CONTROL_SCHEME_PAGE_SELECTORS.canDeleteOrEditWidgets);

    public readonly widgets = computed(() => {
        const scheme = this.store.selectSignal(CONTROL_SCHEME_PAGE_SELECTORS.selectCurrentlyViewedScheme)();
        if (!scheme) {
            return [];
        }
        return scheme.widgets;
    });

    public readonly addableWidgetConfigs = computed(() => {
        const scheme = this.store.selectSignal(CONTROL_SCHEME_PAGE_SELECTORS.selectCurrentlyViewedScheme)();
        if (!scheme) {
            return [];
        }
        const addableWidgetData = this.store.selectSignal(WIDGETS_SECTION_SELECTORS.addableWidgetConfigFactoryBaseData(scheme.name))();
        return this.widgetDefaultConfigFactory.createConfigs(
            addableWidgetData.ios,
            addableWidgetData.portModes,
            addableWidgetData.portModesInfo,
            addableWidgetData.existingWidgets
        );
    });

    public readonly canAddWidgets = computed(() => {
        return this.addableWidgetConfigs().length > 0;
    });

    private sub?: Subscription;

    constructor(
        private readonly store: Store,
        @Inject(CONTROL_SCHEME_WIDGET_CONFIG_FACTORY) private readonly widgetDefaultConfigFactory: IControlSchemeWidgetConfigFactory,
        private readonly dialog: MatDialog,
    ) {
    }

    public onAddWidget(): void {
        const scheme = this.store.selectSignal(CONTROL_SCHEME_PAGE_SELECTORS.selectCurrentlyViewedScheme)();
        const addableWidgetConfigs = this.addableWidgetConfigs();
        if (!scheme || addableWidgetConfigs.length === 0) {
            return;
        }
        this.sub?.unsubscribe();
        this.sub = this.dialog.open<AddWidgetDialogComponent, AddWidgetDialogViewModel, Omit<WidgetConfigModel, 'id'> | undefined>(
            AddWidgetDialogComponent,
            {
                data: {
                    controlSchemeName: scheme.name,
                    addableWidgetConfigs: addableWidgetConfigs
                }
            }
        ).afterClosed().pipe(
            map((widgetConfig) => ({ schemeName: scheme.name, widgetConfig }))
        ).subscribe(({ schemeName, widgetConfig }) => {
            if (widgetConfig) {
                this.store.dispatch(CONTROL_SCHEME_ACTIONS.addWidget({ schemeName, widgetConfig }));
            }
        });
    }

    public onEditWidget(
        widgetIndex: number
    ): void {
        const scheme = this.store.selectSignal(CONTROL_SCHEME_PAGE_SELECTORS.selectCurrentlyViewedScheme)();
        if (!scheme) {
            return;
        }
        this.sub?.unsubscribe();
        this.sub = this.dialog.open<EditWidgetSettingsDialogComponent, WidgetConfigModel, WidgetConfigModel | undefined>(
            EditWidgetSettingsDialogComponent,
            { data: this.widgets()[widgetIndex] }
        ).afterClosed().pipe(
            map((widgetConfig) => ({ schemeName: scheme.name, widgetConfig }))
        ).subscribe(({ schemeName, widgetConfig }) => {
            if (widgetConfig) {
                this.store.dispatch(CONTROL_SCHEME_ACTIONS.updateWidget({ schemeName, widgetConfig }));
            }
        });
    }

    public onDeleteWidget(
        widgetIndex: number
    ): void {
        const scheme = this.store.selectSignal(CONTROL_SCHEME_PAGE_SELECTORS.selectCurrentlyViewedScheme)();
        if (!scheme) {
            return;
        }
        const widgetId = scheme.widgets[widgetIndex].id;
        this.store.dispatch(CONTROL_SCHEME_ACTIONS.deleteWidget({ schemeName: scheme.name, widgetId }));
    }

    public onReorderWidgets(): void {
        const scheme = this.store.selectSignal(CONTROL_SCHEME_PAGE_SELECTORS.selectCurrentlyViewedScheme)();
        if (!scheme) {
            return;
        }
        this.sub?.unsubscribe();
        this.sub = this.dialog.open<ReorderWidgetDialogComponent, WidgetConfigModel[], WidgetConfigModel[]>(
            ReorderWidgetDialogComponent,
            { data: scheme.widgets }
        ).afterClosed().pipe(
            map((result) => ({ schemeName: scheme.name, result }))
        ).subscribe(({ schemeName, result }) => {
            if (result) {
                this.store.dispatch(CONTROL_SCHEME_ACTIONS.reorderWidgets({ schemeName, widgets: result }));
            }
        });
    }

    public ngOnDestroy(): void {
        this.sub?.unsubscribe();
    }
}
