import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentRef, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { PushPipe } from '@ngrx/component';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslocoModule } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { CONTROLLER_SETTINGS_ACTIONS, ControllerSettingsModel } from '@app/store';

import { ControllerSettingsComponentResolverService, IControllerSettingsRenderer } from '../settings-renderers';

@Component({
    standalone: true,
    selector: 'app-controller-settings-container',
    templateUrl: './controller-settings-container.component.html',
    styleUrls: [ './controller-settings-container.component.scss' ],
    imports: [
        MatDividerModule,
        MatButtonModule,
        PushPipe,
        MatExpansionModule,
        TranslocoModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControllerSettingsContainerComponent {
    @ViewChild('container', { static: true, read: ViewContainerRef }) protected readonly viewContainerRef!: ViewContainerRef;

    private _canSave$: Observable<boolean> = EMPTY;

    private settingsComponentRef?: ComponentRef<IControllerSettingsRenderer>;

    constructor(
        private readonly settingsComponentResolver: ControllerSettingsComponentResolverService,
        private readonly store: Store,
        private readonly cdRef: ChangeDetectorRef
    ) {
    }

    public get canSave$(): Observable<boolean> {
        return this._canSave$;
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

        if (this.settingsComponentRef && this.settingsComponentRef.instance instanceof settingsComponentType) {
            this.settingsComponentRef.instance.loadSettings(settings);
            this._canSave$ = this.settingsComponentRef.instance.canSave$;
        } else {
            this.destroyComponent();
            this.settingsComponentRef = this.viewContainerRef.createComponent(settingsComponentType);
            this.settingsComponentRef.instance.loadSettings(settings);
            this._canSave$ = this.settingsComponentRef.instance.canSave$;
        }
        this.cdRef.detectChanges();
    }

    public onSave(): void {
        const settings = this.settingsComponentRef?.instance.readSettings();
        if (!settings) {
            return;
        }
        this.store.dispatch(CONTROLLER_SETTINGS_ACTIONS.updateSettings({ settings }));
    }

    private destroyComponent(): void {
        if (this.settingsComponentRef) {
            this.settingsComponentRef.destroy();
            this.settingsComponentRef = undefined;
        }
    }
}
