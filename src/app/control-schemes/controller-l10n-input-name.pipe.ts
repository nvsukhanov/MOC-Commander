import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { ControllerModel } from '@app/store';

import { ControllerProfileFactoryService } from '../controller-profiles';
import { ControllerInputType } from '@app/shared';

@Pipe({
    standalone: true,
    name: 'controllerL10nInputName',
    pure: true
})
export class ControllerL10nInputNamePipe implements PipeTransform {
    constructor(
        private readonly controllerProfileFactory: ControllerProfileFactoryService,
    ) {
    }

    public transform(
        inputId: string,
        inputType: ControllerInputType,
        controller: ControllerModel
    ): Observable<string> {
        const controllerProfile = this.controllerProfileFactory.getProfile(controller.controllerType, controller.id);
        return inputType === ControllerInputType.Axis ? controllerProfile.getAxisName$(inputId) : controllerProfile.getButtonName$(inputId);
    }
}
