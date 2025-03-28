import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { TitleService } from '@app/shared-misc';
import { ChangelogComponent } from '@app/shared-components';

@Component({
    standalone: true,
    selector: 'page-about',
    templateUrl: './about-page.component.html',
    styleUrl: './about-page.component.scss',
    imports: [
        TranslocoPipe,
        ChangelogComponent,
    ],
    providers: [
        TitleService
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutPageComponent implements OnInit {
    public readonly mocCommanderUrl = 'https://github.com/nvsukhanov/MOC-Commander';

    public readonly rxPoweredUpURL = 'https://github.com/nvsukhanov/rxPoweredUp';

    public readonly licenseURL = 'https://github.com/nvsukhanov/MOC-Commander/blob/main/LICENSE.md';

    constructor(
        private readonly titleService: TitleService,
        private readonly translocoService: TranslocoService,
    ) {
    }

    public ngOnInit(): void {
        this.titleService.setTitle$(this.translocoService.selectTranslate('pageTitle.about'));
    }
}
