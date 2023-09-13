import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';

import packageJson from '../../../package.json';

@Component({
    standalone: true,
    selector: 'app-about-page',
    templateUrl: './about-page.component.html',
    styleUrls: [ './about-page.component.scss' ],
    imports: [
        TranslocoModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutPageComponent {
    public readonly webPoweredUpURL = 'https://github.com/nvsukhanov/webPoweredUp';

    public readonly rxPoweredUpURL = 'https://github.com/nvsukhanov/rxPoweredUp';

    public readonly licenseURL = 'https://github.com/nvsukhanov/webPoweredUp/blob/main/LICENSE.md';

    public readonly version = packageJson.version;
}
