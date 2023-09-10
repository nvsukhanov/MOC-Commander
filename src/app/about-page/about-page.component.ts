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
    public readonly webPoweredUpURL = 'https://github.com/nvsukhanov/webPoweredUP';

    public readonly rxPoweredUpURL = 'https://github.com/nvsukhanov/rxPoweredUP';

    public readonly licenseURL = 'https://github.com/nvsukhanov/webPoweredUP/blob/main/LICENSE.md';

    public readonly version = packageJson.version;
}
