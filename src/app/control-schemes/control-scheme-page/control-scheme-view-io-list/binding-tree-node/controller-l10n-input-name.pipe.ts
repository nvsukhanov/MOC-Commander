import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { ControllerModel } from '@app/store';
import { ControllerInputType } from '@app/shared';

import { ControllerProfileFactoryService } from '../../../../controller-profiles';

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
        const controllerProfile = this.controllerProfileFactory.getByProfileUid(controller.profileUid);
        return inputType === ControllerInputType.Axis ? controllerProfile.getAxisName$(inputId) : controllerProfile.getButtonName$(inputId);
    }
}
