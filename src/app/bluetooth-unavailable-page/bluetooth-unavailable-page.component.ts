import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoPipe } from '@ngneat/transloco';
import { HintComponent } from '@app/shared';

@Component({
    standalone: true,
    selector: 'app-bluetooth-unavailable-page',
    templateUrl: './bluetooth-unavailable-page.component.html',
    styleUrls: [ './bluetooth-unavailable-page.component.scss' ],
    imports: [
        HintComponent,
        TranslocoPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BluetoothUnavailablePageComponent {
    public readonly canIUseBluetoothLink = 'https://caniuse.com/web-bluetooth';
}
