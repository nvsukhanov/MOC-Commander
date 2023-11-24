import { Pipe, PipeTransform } from '@angular/core';
import { RoutesBuilderService } from '@app/shared-misc';

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
        schemeName: string,
        bindingId: number
    ): string[] {
        return this.routesBuilder.bindingView(schemeName, bindingId);
    }

}
