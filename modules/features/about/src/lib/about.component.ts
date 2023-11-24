import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { TitleService } from '@app/shared-misc';

// TODO: inject app version instead of importing package.json
// eslint-disable-next-line @nx/enforce-module-boundaries
import packageJson from '../../../../../package.json';

@Component({
    standalone: true,
    selector: 'feat-about',
    templateUrl: './about.component.html',
    styleUrls: [ './about.component.scss' ],
    imports: [
        TranslocoPipe
    ],
    providers: [
        TitleService
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent implements OnInit {
    public readonly webPoweredAppURL = 'https://github.com/nvsukhanov/webPoweredApp';

    public readonly rxPoweredUpURL = 'https://github.com/nvsukhanov/rxPoweredUp';

    public readonly licenseURL = 'https://github.com/nvsukhanov/webPoweredApp/blob/main/LICENSE.md';

    public readonly version = packageJson.version;

    constructor(
        private readonly titleService: TitleService,
        private readonly translocoService: TranslocoService
    ) {
    }

    public ngOnInit(): void {
        this.titleService.setTitle$(this.translocoService.selectTranslate('pageTitle.about'));
    }
}
