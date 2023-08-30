import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { HintComponent } from '@app/shared';

@Component({
    standalone: true,
    selector: 'app-bluetooth-unavailable',
    templateUrl: './bluetooth-unavailable.component.html',
    styleUrls: [ './bluetooth-unavailable.component.scss' ],
    imports: [
        TranslocoModule,
        HintComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BluetoothUnavailableComponent {
    public readonly canIUseBluetoothLink = 'https://caniuse.com/web-bluetooth';
}
