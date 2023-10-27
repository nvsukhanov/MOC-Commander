import { ChangeDetectionStrategy, Component, ComponentRef, Inject, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { WidgetConfigModel, WidgetType } from '@app/store';

import {
    CONTROL_SCHEME_WIDGET_COMPONENT_RESOLVER,
    ControlSchemeWidgetComponentOfType,
    IControlSchemeWidgetComponentResolver
} from './i-control-scheme-widget-component-resolver';
import { IControlSchemeWidgetComponent } from './i-control-scheme-widget-component';

@Component({
    standalone: true,
    selector: 'app-widget-container',
    templateUrl: './widget-container.component.html',
    styleUrls: [ './widget-container.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetContainerComponent {
    private _canBeEdited = false;

    private _canBeDeleted = false;

    @ViewChild('container', { static: true, read: ViewContainerRef }) private readonly viewContainerRef!: ViewContainerRef;

    private widgetComponentRef?: ComponentRef<IControlSchemeWidgetComponent<WidgetConfigModel>>;

    constructor(
        @Inject(CONTROL_SCHEME_WIDGET_COMPONENT_RESOLVER) private readonly widgetsResolver: IControlSchemeWidgetComponentResolver
    ) {
    }

    @Input()
    public set canBeDeleted(
        value: boolean
    ) {
        this._canBeDeleted = value;
        if (this.widgetComponentRef) {
            this.widgetComponentRef.instance.canBeDeleted = value;
        }
    }

    @Input()
    public set canBeEdited(value: boolean) {
        this._canBeEdited = value;
        if (this.widgetComponentRef) {
            this.widgetComponentRef.instance.canBeEdited = value;
        }
    }

    @Input()
    public set config(
        config: WidgetConfigModel
    ) {
        if (this.widgetComponentRef?.instance.config.widgetType === config.widgetType) {
            if (this.widgetComponentRef.instance.config !== config) {
                this.widgetComponentRef.instance.config = config;
            }
            return;
        }

        if (this.widgetComponentRef) {
            this.destroyWidget();
        }

        this.widgetComponentRef = this.createWidget(config.widgetType);
        if (this.widgetComponentRef) {
            this.widgetComponentRef.instance.config = config;
            this.widgetComponentRef.instance.canBeDeleted = this._canBeDeleted;
            this.widgetComponentRef.instance.canBeEdited = this._canBeEdited;
        }
    }

    private createWidget<T extends WidgetType>(
        widgetType: T
    ): ComponentRef<ControlSchemeWidgetComponentOfType<T>> | undefined {
        const componentType = this.widgetsResolver.resolveWidget(widgetType);
        if (componentType === undefined) {
            return;
        }
        return this.viewContainerRef.createComponent(componentType);
    }

    private destroyWidget(): void {
        if (this.widgetComponentRef) {
            this.widgetComponentRef.destroy();
            this.widgetComponentRef = undefined;
        }
    }
}
