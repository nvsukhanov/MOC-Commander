import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, OnDestroy, Output, ViewContainerRef } from '@angular/core';
import { Subscription, startWith } from 'rxjs';
import { WidgetType } from '@app/shared-misc';
import { WidgetConfigModel } from '@app/store';

import {
    CONTROL_SCHEME_WIDGET_SETTINGS_COMPONENT_FACTORY,
    ControlSchemeWidgetSettingsDescriptor,
    IControlSchemeWidgetSettingsComponentFactory
} from './i-control-scheme-widget-settings-component-factory';

@Component({
    standalone: true,
    selector: 'feat-control-scheme-view-widget-settings-container',
    templateUrl: './widget-settings-container.component.html',
    styleUrls: [ './widget-settings-container.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetSettingsContainerComponent implements OnDestroy {
    @Output() public configChanges = new EventEmitter<WidgetConfigModel | undefined>();

    private widgetSettingsDescriptor?: ControlSchemeWidgetSettingsDescriptor;

    private widgetDescriptorSubscriptions?: Subscription;

    constructor(
        private readonly viewContainerRef: ViewContainerRef,
        @Inject(CONTROL_SCHEME_WIDGET_SETTINGS_COMPONENT_FACTORY) private readonly settingFactory: IControlSchemeWidgetSettingsComponentFactory<WidgetType>
    ) {
    }

    @Input()
    public set config(
        widgetConfig: WidgetConfigModel | undefined
    ) {
        this.destroyWidgetSettings();
        if (widgetConfig) {
            this.widgetSettingsDescriptor = this.settingFactory.createWidgetSettings(this.viewContainerRef, widgetConfig);
            this.widgetDescriptorSubscriptions = this.widgetSettingsDescriptor.configChanges$.pipe(
                startWith(this.widgetSettingsDescriptor.config)
            ).subscribe((config) => {
                this.configChanges.emit(config);
            });
        }
    }

    public ngOnDestroy(): void {
        this.destroyWidgetSettings();
    }

    private destroyWidgetSettings(): void {
        if (this.widgetSettingsDescriptor) {
            this.widgetSettingsDescriptor.destroy();
            this.configChanges.emit(undefined);
        }
        this.widgetDescriptorSubscriptions?.unsubscribe();
        this.widgetDescriptorSubscriptions = undefined;
    }
}
