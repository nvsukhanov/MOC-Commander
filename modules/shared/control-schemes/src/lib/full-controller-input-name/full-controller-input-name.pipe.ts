import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ControlSchemeInput } from '@app/store';

import { FullControllerInputNameService } from './full-controller-input-name.service';

@Pipe({
    standalone: true,
    name: 'fullControllerInputName',
    pure: true
})
export class FullControllerInputNamePipe implements PipeTransform {
    constructor(
        private readonly fullControllerInputNameService: FullControllerInputNameService
    ) {
    }

    public transform(
        data: ControlSchemeInput | undefined
    ): Observable<string> {
        if (!data) {
            return of('');
        }
        return this.fullControllerInputNameService.getFullControllerInputNameData(data).name$;
    }
}
