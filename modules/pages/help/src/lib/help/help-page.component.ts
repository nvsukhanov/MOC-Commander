import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { of } from 'rxjs';
import { InstallationManualsListComponent } from '@app/manuals';
import { RoutesBuilderService, TitleService } from '@app/shared-misc';
import { BreadcrumbsService } from '@app/shared-components';

@Component({
    standalone: true,
    selector: 'page-help',
    templateUrl: './help-page.component.html',
    styleUrl: './help-page.component.scss',
    imports: [
        InstallationManualsListComponent,
        TranslocoPipe,
    ],
    providers: [
        TitleService,
        BreadcrumbsService
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelpPageComponent implements OnInit {
    constructor(
        private readonly titleService: TitleService,
        private readonly translocoService: TranslocoService,
        private readonly routeBuilderService: RoutesBuilderService,
        private breadcrumbs: BreadcrumbsService
    ) {
        this.breadcrumbs.setBreadcrumbsDef(of([
            {
                label$: this.translocoService.selectTranslate('pageTitle.help'),
                route: this.routeBuilderService.help
            }
        ]));
    }

    public ngOnInit(): void {
        this.titleService.setTitle$(this.translocoService.selectTranslate('pageTitle.help'));
    }
}
