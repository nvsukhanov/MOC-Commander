import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';

import { ControllerPluginFactoryService } from '../plugins';
import { ControllerModel } from '../store';
import { ControllerInputType } from '@app/shared';

@Pipe({
    standalone: true,
    name: 'controllerL10nInputName',
    pure: true
})
export class ControllerL10nInputNamePipe implements PipeTransform {
    constructor(
        private readonly controllerPluginFactory: ControllerPluginFactoryService,
    ) {
    }

    public transform(
        inputId: string,
        inputType: ControllerInputType,
        controller: ControllerModel
    ): Observable<string> {
        const plugin = this.controllerPluginFactory.getPlugin(controller.controllerType, controller.id);
        return inputType === ControllerInputType.Axis ? plugin.getAxisName$(inputId) : plugin.getButtonName$(inputId);
    }
}
