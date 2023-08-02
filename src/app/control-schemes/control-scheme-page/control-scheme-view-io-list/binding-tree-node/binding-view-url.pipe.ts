import { Pipe, PipeTransform } from '@angular/core';

import { RoutesBuilderService } from '../../../../routing';

@Pipe({
    standalone: true,
    name: 'bindingViewUrl',
    pure: true
})
export class BindingViewUrlPipe implements PipeTransform {
    constructor(
        private readonly routesBuilder: RoutesBuilderService,
    ) {
    }

    public transform(
        controlSchemeId: string,
        bindingId: string
    ): string[] {
        return this.routesBuilder.bindingView(controlSchemeId, bindingId);
    }

}
