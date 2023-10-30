import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { LetDirective } from '@ngrx/component';
import { NgForOf } from '@angular/common';
import { WidgetConfigModel } from '@app/store';

import { OrderWidgetsPipe } from './order-widgets.pipe';
import { WidgetContainerComponent } from '../widget-container';
import { ControlSchemeWidgetSettingsComponentResolverService } from '../widgets';
import { CONTROL_SCHEME_WIDGET_SETTINGS_RESOLVER, IControlSchemeWidgetSettingsComponentResolver } from '../widget-settings-container';

type WidgetsGridWidgetViewModel = {
    config: WidgetConfigModel;
    hasSettings: boolean;
};

@Component({
    standalone: true,
    selector: 'app-control-scheme-widgets-grid',
    templateUrl: './control-scheme-widgets-grid.component.html',
    styleUrls: [ './control-scheme-widgets-grid.component.scss' ],
    imports: [
        LetDirective,
        NgForOf,
        OrderWidgetsPipe,
        WidgetContainerComponent
    ],
    providers: [
        { provide: CONTROL_SCHEME_WIDGET_SETTINGS_RESOLVER, useClass: ControlSchemeWidgetSettingsComponentResolverService },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeWidgetsGridComponent {
    @Input() public editable = false;

    @Output() public deleteWidget = new EventEmitter<number>();

    @Output() public editWidget = new EventEmitter<number>();

    private _viewModels: WidgetsGridWidgetViewModel[] = [];

    constructor(
        @Inject(CONTROL_SCHEME_WIDGET_SETTINGS_RESOLVER) private readonly widgetSettingsResolver: IControlSchemeWidgetSettingsComponentResolver
    ) {
    }

    @Input()
    public set widgetConfigs(
        data: WidgetConfigModel[]
    ) {
        this._viewModels = data.map((config) => {
            return {
                config,
                hasSettings: !!this.widgetSettingsResolver.resolveWidgetSettings(config.widgetType)
            };
        }).sort((a, b) => a.config.id - b.config.id);
    }

    public get viewModels(): WidgetsGridWidgetViewModel[] {
        return this._viewModels;
    }

    public trackByFn(
        index: number,
        item: WidgetsGridWidgetViewModel
    ): number {
        return item.config.id;
    }

    public onDeleteWidget(
        widgetIndex: number
    ): void {
        this.deleteWidget.emit(widgetIndex);
    }

    public onEditWidget(
        widgetIndex: number
    ): void {
        this.editWidget.emit(widgetIndex);
    }
}
