import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-bluetooth-not-available',
    templateUrl: './bluetooth-not-available.component.html',
    styleUrls: [ './bluetooth-not-available.component.scss' ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BluetoothNotAvailableComponent {

}
