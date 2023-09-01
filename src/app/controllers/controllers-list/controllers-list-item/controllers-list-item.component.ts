import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslocoModule } from '@ngneat/transloco';
import { PushPipe } from '@ngrx/component';
import { MatCardModule } from '@angular/material/card';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { EMPTY, Observable } from 'rxjs';
import { ControllerModel, ControllerProfileFactoryService, ControllerSettingsModel } from '@app/store';
import { ControllerType, ControllerTypeIconNamePipe } from '@app/shared';

import { ControllerSettings, IControllerProfile } from '../../../controller-profiles';
import { ControllerSettingsContainerComponent } from '../controller-settings-container';

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
        MatIconModule,
        NgTemplateOutlet,
        ControllerSettingsContainerComponent,
        ControllerTypeIconNamePipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControllersListItemComponent {
    private _controllerProfile?: IControllerProfile<ControllerSettings | null>;

    private _controllerSettings?: ControllerSettingsModel;

    private _isConnected = false;

    private _controllerType?: ControllerType;

    constructor(
        private readonly controllerProfileFactory: ControllerProfileFactoryService,
    ) {
    }

    @Input()
    public set controller(
        controllerWithSettings: { controller: ControllerModel; settings?: ControllerSettingsModel; isConnected: boolean } | undefined
    ) {
        if (!controllerWithSettings) {
            this._controllerProfile = undefined;
            this._controllerSettings = undefined;
            this._isConnected = false;
            return;
        }
        this._controllerProfile = this.controllerProfileFactory.getByProfileUid(
            controllerWithSettings.controller.profileUid
        );
        this._controllerSettings = controllerWithSettings?.settings;
        this._isConnected = controllerWithSettings?.isConnected ?? false;
        this._controllerType = controllerWithSettings.controller.controllerType;
    }

    public get controllerName$(): Observable<string> {
        return this._controllerProfile?.name$ ?? EMPTY;
    }

    public get controllerType(): ControllerType | undefined {
        return this._controllerType;
    }

    public get controllerSettings(): ControllerSettingsModel | undefined {
        return this._controllerSettings;
    }

    public get isConnected(): boolean {
        return this._isConnected;
    }
}
