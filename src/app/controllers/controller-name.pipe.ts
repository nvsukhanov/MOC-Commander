import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { ControllerModel, ControllerProfilesFacadeService } from '@app/store';

@Pipe({
    standalone: true,
    name: 'controllerName',
    pure: true
})
export class ControllerNamePipe implements PipeTransform {
    constructor(
        private readonly controllerFacadeService: ControllerProfilesFacadeService
    ) {
    }

    public transform(
        model: ControllerModel
    ): Observable<string> {
        return this.controllerFacadeService.getByControllerModel(model).name$;
    }
}
