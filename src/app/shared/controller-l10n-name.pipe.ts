import { Pipe, PipeTransform } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Observable } from 'rxjs';

import { ControllerModel } from '../store';
import { ControllerPluginFactoryService } from '../plugins';

@Pipe({
    standalone: true,
    name: 'controllerL10nName',
    pure: true
})
export class ControllerL10nNamePipe implements PipeTransform {
    constructor(
        private readonly controllerPluginFactory: ControllerPluginFactoryService,
        private readonly translocoService: TranslocoService
    ) {
    }

    public transform(
        controller: ControllerModel
    ): Observable<string> {
        const l10nKey = this.controllerPluginFactory.getPlugin(controller.controllerType, controller.id).nameL10nKey;
        return this.translocoService.selectTranslate(l10nKey);
    }

}
