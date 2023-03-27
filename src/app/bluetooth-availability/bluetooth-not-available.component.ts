import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
    standalone: true,
    selector: 'app-bluetooth-not-available',
    templateUrl: './bluetooth-not-available.component.html',
    styleUrls: [ './bluetooth-not-available.component.scss' ],
    imports: [
        TranslocoModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BluetoothNotAvailableComponent {

}
