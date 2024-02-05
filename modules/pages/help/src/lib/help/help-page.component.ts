import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { InstallationManualsListComponent } from '@app/manuals';
import { TitleService } from '@app/shared-misc';

@Component({
    standalone: true,
    selector: 'page-help',
    templateUrl: './help-page.component.html',
    styleUrls: [ './help-page.component.scss' ],
    imports: [
        InstallationManualsListComponent,
        TranslocoPipe
    ],
    providers: [
        TitleService
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelpPageComponent implements OnInit {
    constructor(
        private readonly titleService: TitleService,
        private readonly translocoService: TranslocoService,
    ) {
    }

    public ngOnInit(): void {
        this.titleService.setTitle$(this.translocoService.selectTranslate('pageTitle.help'));
    }
}
