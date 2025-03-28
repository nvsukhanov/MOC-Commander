import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Inject, Input, OnDestroy, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { WidgetType } from '@app/shared-misc';
import { WidgetConfigModel } from '@app/store';

import {
    CONTROL_SCHEME_WIDGET_COMPONENT_FACTORY,
    ControlSchemeWidgetDescriptor,
    IControlSchemeWidgetComponentFactory
} from '../i-control-scheme-widget-component-factory';

@Component({
    standalone: true,
    selector: 'page-control-scheme-view-widget-container',
    templateUrl: './widget-container.component.html',
    styleUrl: './widget-container.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetContainerComponent implements OnDestroy {
    @Output() public readonly edit = new EventEmitter<void>();

    @Output() public readonly delete = new EventEmitter<void>();

    private _canBeEdited = false;

    private _canBeDeleted = false;

    @ViewChild('container', { static: true, read: ViewContainerRef }) private readonly viewContainerRef!: ViewContainerRef;

    private widgetDescriptor?: ControlSchemeWidgetDescriptor;

    private widgetActionsSubscription?: Subscription;

    private colSpan = 'span 1';

    private rowSpan = 'span 1';

    constructor(
        @Inject(CONTROL_SCHEME_WIDGET_COMPONENT_FACTORY) private readonly widgetFactory: IControlSchemeWidgetComponentFactory<WidgetType>
    ) {
    }

    @HostBinding('style.grid-column')
    public get gridColumn(): string {
        return this.colSpan;
    }

    @HostBinding('style.grid-row')
    public get gridRow(): string {
        return this.rowSpan;
    }

    @Input()
    public set canBeDeleted(
        value: boolean
    ) {
        this._canBeDeleted = value;
        if (this.widgetDescriptor) {
            this.widgetDescriptor.setCanBeDeleted(value);
        }
    }

    @Input()
    public set canBeEdited(value: boolean) {
        this._canBeEdited = value;
        if (this.widgetDescriptor) {
            this.widgetDescriptor.setCanBeEdited(value);
        }
    }

    @Input()
    public set config(
        config: WidgetConfigModel
    ) {
        this.updateSpans(config);
        this.destroyWidget();
        this.widgetDescriptor = this.widgetFactory.createWidget(this.viewContainerRef, config);
        this.widgetActionsSubscription = this.widgetDescriptor.edit$.subscribe(() => this.edit.emit());
        this.widgetActionsSubscription.add(this.widgetDescriptor.delete$.subscribe(() => this.delete.emit()));
        this.widgetDescriptor.setCanBeDeleted(this._canBeDeleted);
        this.widgetDescriptor.setCanBeEdited(this._canBeEdited);
    }

    public ngOnDestroy(): void {
        this.destroyWidget();
    }

    private destroyWidget(): void {
        if (this.widgetDescriptor) {
            this.widgetDescriptor.destroy();
            this.widgetDescriptor = undefined;
            this.widgetActionsSubscription?.unsubscribe();
            this.widgetActionsSubscription = undefined;
        }
    }

    private updateSpans(
        config: WidgetConfigModel
    ): void {
        this.colSpan = `span ${config.width}`;
        this.rowSpan = `span ${config.height}`;
    }
}
