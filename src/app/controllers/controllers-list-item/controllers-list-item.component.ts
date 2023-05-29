import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Controller } from '../../store';
import { ControllerPluginFactoryService, IControllerPlugin } from '../../plugins';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslocoModule } from '@ngneat/transloco';
import { PushPipe } from '@ngrx/component';

@Component({
    standalone: true,
    selector: 'app-controllers-list-item',
    templateUrl: './controllers-list-item.component.html',
    styleUrls: [ './controllers-list-item.component.scss' ],
    imports: [
        MatExpansionModule,
        TranslocoModule,
        PushPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControllersListItemComponent {
    private _controllerPlugin: IControllerPlugin = this.controllerPluginFactoryService.getPlugin();

    constructor(
        private readonly controllerPluginFactoryService: ControllerPluginFactoryService,
    ) {
    }

    @Input()
    public set controller(
        controller: Controller | undefined
    ) {
        this._controllerPlugin = this.controllerPluginFactoryService.getPlugin(controller?.controllerType, controller?.id);
    }

    public get controllerNameL10nKey(): string {
        return this._controllerPlugin.nameL10nKey;
    }
}
