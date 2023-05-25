import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
    standalone: true,
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: [ './about.component.scss' ],
    imports: [
        TranslocoModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {
    public readonly authorProfileURL = 'https://www.linkedin.com/in/nvsukhanov/';

    public readonly ngPoweredUpURL = 'https://github.com/nvsukhanov/ngPoweredUP';

    public readonly rxPoweredUpURL = 'https://github.com/nvsukhanov/rxPoweredUP';

    public readonly licenseURL = 'https://github.com/nvsukhanov/ngPoweredUP/blob/main/LICENSE.md';
}
