import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { InstallationManualsListComponent } from '@app/manuals';
import { RoutesBuilderService, TitleService } from '@app/shared-misc';
import { FeatureToolbarBreadcrumbsDirective, FeatureToolbarControlsDirective, IBreadcrumbDefinition } from '@app/shared-ui';

@Component({
    standalone: true,
    selector: 'page-help',
    templateUrl: './help-page.component.html',
    styleUrls: [ './help-page.component.scss' ],
    imports: [
        InstallationManualsListComponent,
        TranslocoPipe,
        FeatureToolbarControlsDirective,
        FeatureToolbarBreadcrumbsDirective
    ],
    providers: [
        TitleService
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelpPageComponent implements OnInit {
    public readonly breadcrumbsDef: ReadonlyArray<IBreadcrumbDefinition> = [
        {
            label$: this.translocoService.selectTranslate('pageTitle.help'),
            route: this.routeBuilderService.help
        }
    ];

    constructor(
        private readonly titleService: TitleService,
        private readonly translocoService: TranslocoService,
        private readonly routeBuilderService: RoutesBuilderService
    ) {
    }

    public ngOnInit(): void {
        this.titleService.setTitle$(this.translocoService.selectTranslate('pageTitle.help'));
    }
}
