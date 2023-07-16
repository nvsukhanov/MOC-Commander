import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, Type } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslocoModule } from '@ngneat/transloco';
import { PushPipe } from '@ngrx/component';
import { MatCardModule } from '@angular/material/card';
import { NgIf } from '@angular/common';

import { ControllerProfileFactoryService, IControllerProfile, IControllerSettingsComponent } from '../../controller-profiles';
import { ControllerModel, ControllerSettingsModel } from '../../store';
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
        ControllerSettingsRenderDirective
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControllersListItemComponent {
    @Output() public readonly settingsChanges = new EventEmitter<ControllerSettingsModel>();

    private _controllerProfile: IControllerProfile = this.controllerProfileFactory.getProfile();

    private _controllerSettings?: ControllerSettingsModel;

    constructor(
        private readonly controllerProfileFactory: ControllerProfileFactoryService,
    ) {
    }

    @Input()
    public set controller(
        controllerWithSettings: { controller: ControllerModel; settings?: ControllerSettingsModel } | undefined
    ) {
        this._controllerProfile = this.controllerProfileFactory.getProfile(
            controllerWithSettings?.controller?.controllerType,
            controllerWithSettings?.controller?.id
        );
        this._controllerSettings = controllerWithSettings?.settings;
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

    public controllerSettingsUpdate(
        settings: ControllerSettingsModel
    ): void {
        this.settingsChanges.emit(settings);
    }
}
