import { Pipe, PipeTransform } from '@angular/core';
import { RoutesBuilderService } from '@app/shared-misc';

@Pipe({
    standalone: true,
    name: 'controllerViewHref',
    pure: true
})
export class ControllerViewHrefPipe implements PipeTransform {
    constructor(
        private readonly routesBuilderService: RoutesBuilderService
    ) {
    }

    public transform(
        controllerId: string
    ): string[] {
        return this.routesBuilderService.controllerView(controllerId);
    }
}
