import { Directive, OnDestroy, OnInit, TemplateRef } from '@angular/core';

import { FeatureToolbarService } from './feature-toolbar-service';

@Directive({
    standalone: true,
    selector: '[appFeatureToolbarControls]'
})
export class FeatureToolbarControlsDirective implements OnInit, OnDestroy {
    constructor(
        private readonly featureToolbarService: FeatureToolbarService,
        private readonly templateRef: TemplateRef<unknown>
    ) {
    }

    public ngOnInit(): void {
        this.featureToolbarService.setControls(this.templateRef);
    }

    public ngOnDestroy(): void {
        this.featureToolbarService.clearConfig();
    }
}
