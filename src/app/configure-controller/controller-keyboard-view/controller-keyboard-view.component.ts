import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ControllerState } from '../../store';
import { JsonPipe, KeyValuePipe, NgForOf, NgIf } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-controller-keyboard-view',
    templateUrl: 'controller-keyboard-view.component.html',
    styleUrls: [ './controller-keyboard-view.component.scss' ],
    imports: [
        NgForOf,
        NgIf,
        KeyValuePipe,
        JsonPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControllerKeyboardViewComponent {
    @Input() public controllerState?: ControllerState;
}
