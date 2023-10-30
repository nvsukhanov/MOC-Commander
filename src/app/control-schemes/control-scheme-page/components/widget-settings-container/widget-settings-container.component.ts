import { ChangeDetectionStrategy, Component, ComponentRef, EventEmitter, Inject, Input, OnDestroy, Output, ViewContainerRef } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { WidgetConfigModel } from '@app/store';
import { DeepPartial } from '@app/shared';

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
    @Output() public save = new EventEmitter<WidgetConfigModel>();

    private widgetSettingsComponentRef?: ComponentRef<IControlSchemeWidgetSettingsComponent<WidgetConfigModel>>;

    private widgetSettingsSaveSubscription?: Subscription;

    private _canSave = new BehaviorSubject<boolean>(false);

    constructor(
        private readonly viewContainerRef: ViewContainerRef,
        @Inject(CONTROL_SCHEME_WIDGET_SETTINGS_RESOLVER) private readonly widgetSettingsResolver: IControlSchemeWidgetSettingsComponentResolver
    ) {
    }

    @Output()
    public get canSave(): Observable<boolean> {
        return this._canSave;
    }

    @Input()
    public set initialConfig(
        widgetConfig: Pick<WidgetConfigModel, 'widgetType'> & DeepPartial<WidgetConfigModel>
    ) {
        this.widgetSettingsComponentRef = this.createWidgetSettings(widgetConfig);
    }

    public getConfig(): WidgetConfigModel | null {
        return this.widgetSettingsComponentRef?.instance.getConfig() ?? null;
    }

    public ngOnDestroy(): void {
        this.destroyWidgetSettings();
    }

    private createWidgetSettings(
        widgetConfigModel: Pick<WidgetConfigModel, 'widgetType'> & DeepPartial<WidgetConfigModel>,
    ): ComponentRef<IControlSchemeWidgetSettingsComponent<WidgetConfigModel>> | undefined {
        this.destroyWidgetSettings();
        const componentType = this.widgetSettingsResolver.resolveWidgetSettings(widgetConfigModel.widgetType);
        if (componentType === undefined) {
            return;
        }
        const result = this.viewContainerRef.createComponent(componentType);
        result.instance.useConfig(widgetConfigModel);

        this.widgetSettingsSaveSubscription = result.instance.canSave$.subscribe((v) => {
            this._canSave.next(v);
        });

        // There are two events that can trigger a save:
        // 1. The user clicks the save button
        // 2. The user submits the form (e.g. by pressing enter)
        // Here we handle the second case.
        this.widgetSettingsSaveSubscription.add(
            result.instance.save.subscribe((config) => this.save.emit(config)
            ));
        return result;
    }

    private destroyWidgetSettings(): void {
        if (this.widgetSettingsComponentRef) {
            this.widgetSettingsComponentRef.destroy();
            this.widgetSettingsComponentRef = undefined;
        }
        this.widgetSettingsSaveSubscription?.unsubscribe();
        this.widgetSettingsSaveSubscription = undefined;
        this._canSave.next(false);
    }
}
