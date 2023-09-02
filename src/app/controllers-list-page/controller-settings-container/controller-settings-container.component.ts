import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentRef, Input, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { CONTROLLER_SETTINGS_ACTIONS, ControllerSettingsModel } from '@app/store';

import { ControllerSettingsComponentResolverService, IControllerSettingsRenderer } from '../settings-renderers';

@Component({
    standalone: true,
    selector: 'app-controller-settings-container',
    templateUrl: './controller-settings-container.component.html',
    styleUrls: [ './controller-settings-container.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControllerSettingsContainerComponent implements OnDestroy {
    @ViewChild('container', { static: true, read: ViewContainerRef }) protected readonly viewContainerRef!: ViewContainerRef;

    private settingsComponentRef?: ComponentRef<IControllerSettingsRenderer>;

    private settingsChangesSubscription?: Subscription;

    constructor(
        private readonly settingsComponentResolver: ControllerSettingsComponentResolverService,
        private readonly store: Store,
        private readonly cdRef: ChangeDetectorRef
    ) {
    }

    @Input()
    public set controllerSettings(
        settings: ControllerSettingsModel | undefined
    ) {
        if (!settings) {
            this.destroyComponent();
            return;
        }
        const settingsComponentType = this.settingsComponentResolver.resolveComponentFor(settings?.controllerType);
        if (!settingsComponentType) {
            this.destroyComponent();
            return;
        }

        if (!this.settingsComponentRef || !(this.settingsComponentRef.instance instanceof settingsComponentType)) {
            this.destroyComponent();
            this.settingsComponentRef = this.viewContainerRef.createComponent(settingsComponentType);
            this.settingsComponentRef.instance.loadSettings(settings);
            this.settingsChangesSubscription = this.settingsComponentRef.instance.settingsChanges$.subscribe((nextSettings) => {
                this.store.dispatch(CONTROLLER_SETTINGS_ACTIONS.updateSettings({ settings: nextSettings }));
            });
            this.cdRef.detectChanges();
        }
    }

    public ngOnDestroy(): void {
        this.settingsChangesSubscription?.unsubscribe();
    }

    private destroyComponent(): void {
        if (this.settingsComponentRef) {
            this.settingsComponentRef.destroy();
            this.settingsComponentRef = undefined;
        }
    }
}
