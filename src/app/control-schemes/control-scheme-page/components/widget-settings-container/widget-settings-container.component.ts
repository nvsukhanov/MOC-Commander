import { ChangeDetectionStrategy, Component, ComponentRef, EventEmitter, Inject, Input, OnDestroy, Output, ViewContainerRef } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { WidgetConfigModel } from '@app/store';

import { IControlSchemeWidgetSettingsComponent } from './i-control-scheme-widget-settings-component';
import { CONTROL_SCHEME_WIDGET_SETTINGS_RESOLVER, IControlSchemeWidgetSettingsComponentResolver } from './i-control-scheme-widget-settings-component-resolver';

@Component({
    standalone: true,
    selector: 'app-widget-settings-container',
    templateUrl: './widget-settings-container.component.html',
    styleUrls: [ './widget-settings-container.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'widgetSettingsContainer'
})
export class WidgetSettingsContainerComponent implements OnDestroy {
    @Output() public configChanges = new EventEmitter<WidgetConfigModel>();

    private widgetSettingsComponentRef?: ComponentRef<IControlSchemeWidgetSettingsComponent<WidgetConfigModel>>;

    private widgetSettingsSaveSubscription?: Subscription;

    private _valid = new BehaviorSubject<boolean>(false);

    constructor(
        private readonly viewContainerRef: ViewContainerRef,
        @Inject(CONTROL_SCHEME_WIDGET_SETTINGS_RESOLVER) private readonly widgetSettingsResolver: IControlSchemeWidgetSettingsComponentResolver
    ) {
    }

    @Output()
    public get valid(): Observable<boolean> {
        return this._valid;
    }

    @Input()
    public set config(
        widgetConfig: WidgetConfigModel | undefined
    ) {
        if (!widgetConfig) {
            this.destroyWidgetSettings();
            return;
        }
        this.widgetSettingsComponentRef = this.createWidgetSettingsComponent(widgetConfig);
    }

    public ngOnDestroy(): void {
        this.destroyWidgetSettings();
    }

    private createWidgetSettingsComponent(
        widgetConfigModel: WidgetConfigModel
    ): ComponentRef<IControlSchemeWidgetSettingsComponent<WidgetConfigModel>> | undefined {
        this.destroyWidgetSettings();
        const componentType = this.widgetSettingsResolver.resolveWidgetSettings(widgetConfigModel.widgetType);
        if (componentType === undefined) {
            this._valid.next(true);
            this.configChanges.emit(widgetConfigModel);
            return;
        }

        const result = this.viewContainerRef.createComponent(componentType);
        this.widgetSettingsSaveSubscription = result.instance.valid.subscribe((v) => {
            this._valid.next(v);
        });

        this.widgetSettingsSaveSubscription.add(
            result.instance.configChanges.subscribe((config) => this.configChanges.emit(config))
        );
        result.setInput('config', widgetConfigModel);
        return result;
    }

    private destroyWidgetSettings(): void {
        if (this.widgetSettingsComponentRef) {
            this.widgetSettingsComponentRef.destroy();
            this.widgetSettingsComponentRef = undefined;
        }
        this.widgetSettingsSaveSubscription?.unsubscribe();
        this.widgetSettingsSaveSubscription = undefined;
        this._valid.next(false);
    }
}
