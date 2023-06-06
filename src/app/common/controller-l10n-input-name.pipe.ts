import { Pipe, PipeTransform } from '@angular/core';
import { ControllerPluginFactoryService } from '../plugins';
import { Controller, ControllerInputType } from '../store';
import { Observable } from 'rxjs';

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
        controller: Controller
    ): Observable<string> {
        const plugin = this.controllerPluginFactory.getPlugin(controller.controllerType, controller.id);
        return inputType === ControllerInputType.Axis ? plugin.getAxisName$(inputId) : plugin.getButtonName$(inputId);
    }
}
