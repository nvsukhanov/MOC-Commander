import { Pipe, PipeTransform } from '@angular/core';
import { ControlSchemeModel } from '@app/store';

import { RoutesBuilderService } from '../../routing';

@Pipe({
    standalone: true,
    name: 'controlSchemeViewUrl',
    pure: true
})
export class ControlSchemeViewUrlPipe implements PipeTransform {
    constructor(
        private readonly routesBuilder: RoutesBuilderService,
    ) {
    }

    public transform(
        controlScheme: ControlSchemeModel
    ): string[] {
        return this.routesBuilder.controlSchemeView(controlScheme.name);
    }
}
