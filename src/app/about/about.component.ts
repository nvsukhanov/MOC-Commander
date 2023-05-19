import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FeatureContentContainerComponent, FeatureToolbarComponent } from '../common';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
    standalone: true,
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: [ './about.component.scss' ],
    imports: [
        FeatureToolbarComponent,
        TranslocoModule,
        FeatureContentContainerComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {
    public readonly authorProfileURL = 'https://www.linkedin.com/in/nvsukhanov/';

    public readonly ngPoweredUpURL = 'https://github.com/nvsukhanov/ngPoweredUP';

    public readonly rxPoweredUpURL = 'https://github.com/nvsukhanov/rxPoweredUP';

    public readonly licenseURL = 'https://github.com/nvsukhanov/ngPoweredUP/blob/main/LICENSE.md';
}
