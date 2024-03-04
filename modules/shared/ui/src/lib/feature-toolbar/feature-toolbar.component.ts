import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Observable, Subscription } from 'rxjs';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';

import { FeatureToolbarService } from './feature-toolbar-service';
import { BreadcrumbsComponent, IBreadcrumbDefinition } from '../breadcrumbs';
import { HideOnSmallScreenDirective } from '../hide-on-small-screen.directive';
import { FeatureToolbarBreadcrumbsService } from './feature-toolbar-breadcrumbs.service';

@Component({
    standalone: true,
    selector: 'lib-feature-toolbar',
    templateUrl: './feature-toolbar.component.html',
    styleUrls: [ './feature-toolbar.component.scss' ],
    imports: [
        MatToolbarModule,
        NgTemplateOutlet,
        BreadcrumbsComponent,
        HideOnSmallScreenDirective,
        AsyncPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureToolbarComponent implements OnInit, OnDestroy {
    public readonly controlsTemplate$: Observable<TemplateRef<unknown> | null> = this.featureToolbarService.controlsTemplate$;

    private _breadcrumbDef: ReadonlyArray<IBreadcrumbDefinition> = [];

    private sub?: Subscription;

    constructor(
        protected readonly featureToolbarService: FeatureToolbarService,
        protected readonly breadcrumbsService: FeatureToolbarBreadcrumbsService,
        private readonly cdRed: ChangeDetectorRef
    ) {
    }

    public get breadcrumbDef(): ReadonlyArray<IBreadcrumbDefinition> {
        return this._breadcrumbDef;
    }

    public ngOnInit(): void {
        // TODO: This is a workaround for the issue with the breadcrumbs not updating when the path changes.
        // use service to update the breadcrumbs in component instead of using directive
        this.sub = this.breadcrumbsService.breadcrumbsDef$.subscribe((pathDefinitions) => {
            this._breadcrumbDef = pathDefinitions ?? [];
            this.cdRed.detectChanges();
        });
    }

    public ngOnDestroy(): void {
        this.sub?.unsubscribe();
    }
}
