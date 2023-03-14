import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-connect-controller',
    templateUrl: './connect-controller.component.html',
    styleUrls: ['./connect-controller.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectControllerComponent {

}
