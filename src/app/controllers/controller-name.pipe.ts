import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { ControllerModel, ControllerProfileFactoryService } from '@app/store';

@Pipe({
    standalone: true,
    name: 'controllerName',
    pure: true
})
export class ControllerNamePipe implements PipeTransform {
    constructor(
        private readonly controllerProfileFactory: ControllerProfileFactoryService,
    ) {
    }

    public transform(
        model: ControllerModel
    ): Observable<string> {
        return this.controllerProfileFactory.getByProfileUid(model.profileUid).name$;

    }
}
