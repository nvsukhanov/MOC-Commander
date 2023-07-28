import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, Type } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslocoModule } from '@ngneat/transloco';
import { PushPipe } from '@ngrx/component';
import { MatCardModule } from '@angular/material/card';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ControllerModel, ControllerSettingsModel } from '@app/store';
import { NotConnectedInlineIconComponent } from '@app/shared';

import { ControllerProfileFactoryService, IControllerProfile, IControllerSettingsComponent } from '../../../controller-profiles';
import { ControllerSettingsRenderDirective } from './controller-settings-render.directive';

@Component({
    standalone: true,
    selector: 'app-controllers-list-item',
    templateUrl: './controllers-list-item.component.html',
    styleUrls: [ './controllers-list-item.component.scss' ],
    imports: [
        MatExpansionModule,
        TranslocoModule,
        PushPipe,
        MatCardModule,
        NgIf,
        ControllerSettingsRenderDirective,
        MatIconModule,
        NgTemplateOutlet,
        NotConnectedInlineIconComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControllersListItemComponent {
    @Output() public readonly settingsChanges = new EventEmitter<ControllerSettingsModel>();

    private _controllerProfile: IControllerProfile = this.controllerProfileFactory.getProfile();

    private _controllerSettings?: ControllerSettingsModel;

    private _isConnected = false;

    constructor(
        private readonly controllerProfileFactory: ControllerProfileFactoryService,
    ) {
    }

    @Input()
    public set controller(
        controllerWithSettings: { controller: ControllerModel; settings?: ControllerSettingsModel; isConnected: boolean } | undefined
    ) {
        this._controllerProfile = this.controllerProfileFactory.getByProfileUid(
            controllerWithSettings?.controller?.profileUid
        );
        this._controllerSettings = controllerWithSettings?.settings;
        this._isConnected = controllerWithSettings?.isConnected ?? false;
    }

    public get controllerSettingsComponent(): Type<IControllerSettingsComponent> | undefined {
        return this._controllerProfile.settingsComponent;
    }

    public get controllerNameL10nKey(): string {
        return this._controllerProfile.nameL10nKey;
    }

    public get controllerSettings(): ControllerSettingsModel | undefined {
        return this._controllerSettings;
    }

    public get isConnected(): boolean {
        return this._isConnected;
    }

    public controllerSettingsUpdate(
        settings: ControllerSettingsModel
    ): void {
        this.settingsChanges.emit(settings);
    }
}
