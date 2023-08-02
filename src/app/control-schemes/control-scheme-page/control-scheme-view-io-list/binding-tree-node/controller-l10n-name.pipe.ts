import { Pipe, PipeTransform } from '@angular/core';
import { ControllerModel } from '@app/store';

import { ControllerProfileFactoryService } from '../../../../controller-profiles';

@Pipe({
    standalone: true,
    name: 'controllerL10nName',
    pure: true
})
export class ControllerL10nNamePipe implements PipeTransform {
    constructor(
        private readonly controllerProfileFactory: ControllerProfileFactoryService,
    ) {
    }

    public transform(
        controllerModel: ControllerModel
    ): string {
        return this.controllerProfileFactory.getByProfileUid(controllerModel.profileUid).nameL10nKey;
    }
}
