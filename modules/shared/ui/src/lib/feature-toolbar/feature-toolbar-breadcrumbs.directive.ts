import { Directive, Input, OnDestroy } from '@angular/core';

import { IBreadcrumbDefinition } from '../breadcrumbs';
import { FeatureToolbarBreadcrumbsService } from './feature-toolbar-breadcrumbs.service';

@Directive({
    standalone: true,
    selector: '[libFeatureToolbarBreadcrumbs]'
})
export class FeatureToolbarBreadcrumbsDirective implements OnDestroy {
    constructor(
        private readonly featureToolbarService: FeatureToolbarBreadcrumbsService,
    ) {
    }

    @Input('libFeatureToolbarBreadcrumbs')
    public set breadcrumbsDef(
        v: ReadonlyArray<IBreadcrumbDefinition> | undefined
    ) {
        if (v) {
            this.featureToolbarService.setBreadcrumbsDef(v);
        } else {
            this.featureToolbarService.clearBreadcrumbs();
        }
    }

    public ngOnDestroy(): void {
        this.featureToolbarService.clearBreadcrumbs();
    }
}
