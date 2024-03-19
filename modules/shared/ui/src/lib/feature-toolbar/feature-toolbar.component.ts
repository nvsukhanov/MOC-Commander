import { ChangeDetectionStrategy, Component, TemplateRef } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Observable } from 'rxjs';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { ScreenSizeObserverService } from '@app/shared-misc';

import { FeatureToolbarService } from './feature-toolbar-service';
import { HideOnSmallScreenDirective } from '../hide-on-small-screen.directive';
import { BreadcrumbsComponent } from '../breadcrumbs';

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
export class FeatureToolbarComponent {
    public readonly controlsTemplate$: Observable<TemplateRef<unknown> | null> = this.featureToolbarService.controlsTemplate$;

    constructor(
        protected readonly featureToolbarService: FeatureToolbarService,
        protected readonly screenSizeObserverService: ScreenSizeObserverService
    ) {
    }
}
