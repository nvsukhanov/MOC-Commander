import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { InstallationManualsListComponent } from '@app/manuals';
import { TitleService } from '@app/shared-misc';

@Component({
    standalone: true,
    selector: 'feat-help',
    templateUrl: './help.component.html',
    styleUrls: [ './help.component.scss' ],
    imports: [
        InstallationManualsListComponent,
        TranslocoPipe
    ],
    providers: [
        TitleService
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelpComponent implements OnInit {
    constructor(
        private readonly titleService: TitleService,
        private readonly translocoService: TranslocoService,
    ) {
    }

    public ngOnInit(): void {
        this.titleService.setTitle$(this.translocoService.selectTranslate('pageTitle.help'));
    }
}
