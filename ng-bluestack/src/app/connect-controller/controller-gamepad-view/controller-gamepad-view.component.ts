import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { GamepadControllerConfig } from '../../store';
import { ControllerState } from '../../types';
import { JsonPipe, NgIf } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-controller-gamepad-view',
    templateUrl: './controller-gamepad-view.component.html',
    styleUrls: [ './controller-gamepad-view.component.scss' ],
    imports: [
        JsonPipe,
        NgIf
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControllerGamepadViewComponent {
    @Input() public controllerConfig?: GamepadControllerConfig;
    @Input() public controllerState?: ControllerState;
}
