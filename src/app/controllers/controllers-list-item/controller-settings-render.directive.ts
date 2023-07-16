import { ComponentRef, Directive, EventEmitter, Input, Output, Type, ViewContainerRef } from '@angular/core';

import { IControllerSettingsComponent } from '../../controller-profiles';
import { ControllerSettingsModel } from '../../store';

@Directive({
    standalone: true,
    selector: '[appControllerSettingsRender]'
})
export class ControllerSettingsRenderDirective<TSettings extends ControllerSettingsModel> {
    @Output() public readonly settingsChanges = new EventEmitter<ControllerSettingsModel>();

    private controllerSettingsComponentType?: Type<IControllerSettingsComponent<TSettings>>;

    private settingsComponentViewRef?: ComponentRef<IControllerSettingsComponent<TSettings>>;

    private settings?: TSettings;

    constructor(
        private readonly viewContainerRef: ViewContainerRef,
    ) {
    }

    @Input()
    public set controllerSettings(
        settings: TSettings | undefined
    ) {
        if (this.settingsComponentViewRef && settings) {
            this.settingsComponentViewRef.instance.loadSettings(settings);
        }
        this.settings = settings;
    }

    @Input('appControllerSettingsRender')
    public set controllerSettingsComponent(
        component: Type<IControllerSettingsComponent<TSettings>> | undefined
    ) {
        if (component !== this.controllerSettingsComponentType) {
            this.destroyComponent();
            this.controllerSettingsComponentType = component;
            if (component) {
                this.settingsComponentViewRef = this.viewContainerRef.createComponent(component);
                this.settingsComponentViewRef.instance.registerSettingsChangesFn((settings) => {
                    this.settingsChanges.emit(settings);
                });
                if (this.settings) {
                    this.settingsComponentViewRef.instance.loadSettings(this.settings);
                }
                this.controllerSettingsComponentType = component;
            }
        }
    }

    private destroyComponent(): void {
        this.settingsComponentViewRef?.destroy();
        this.settingsComponentViewRef = undefined;
    }
}
