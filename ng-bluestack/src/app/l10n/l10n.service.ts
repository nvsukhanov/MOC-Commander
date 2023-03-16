import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class L10nService {
    public readonly configureController$ = new BehaviorSubject('Configure controller');
    public readonly configureHub$ = new BehaviorSubject('Configure hub');

    public readonly selectControllerType$ = new BehaviorSubject('Select controller type');
    public readonly connectToController$ = new BehaviorSubject('Connect');
    public readonly cancelListeningForController$ = new BehaviorSubject('Cancel listening');

    public readonly controllerTypeUnassigned$ = new BehaviorSubject('Unassigned');
    public readonly controllerTypeGamepad$ = new BehaviorSubject('Gamepad');
    public readonly controllerDisconnect$ = new BehaviorSubject('Disconnect');

    public readonly dualshockName$ = new BehaviorSubject('Dualshock'); // TODO: move to corresponding plugin
    public readonly dualshockL1$ = new BehaviorSubject('L1');
    public readonly dualshockL2$ = new BehaviorSubject('L2');
    public readonly dualshockR1$ = new BehaviorSubject('R1');
    public readonly dualshockR2$ = new BehaviorSubject('R2');
    public readonly dualshockButtonCross$ = new BehaviorSubject('Cross');
    public readonly dualshockButtonCircle$ = new BehaviorSubject('Circle');
    public readonly dualshockButtonTriangle$ = new BehaviorSubject('Triangle');
    public readonly dualshockButtonSquare$ = new BehaviorSubject('Square');
    public readonly dualshockButtonLeftStick$ = new BehaviorSubject('Left stick press');
    public readonly dualshockButtonRightStick$ = new BehaviorSubject('Right stick press');
    public readonly dualshockButtonShare$ = new BehaviorSubject('Share');
    public readonly dualshockButtonOptions$ = new BehaviorSubject('Options');
    public readonly dualshockButtonPS$ = new BehaviorSubject('PS button');
    public readonly dualshockButtonUp$ = new BehaviorSubject('Up');
    public readonly dualshockButtonDown$ = new BehaviorSubject('Down');
    public readonly dualshockButtonLeft$ = new BehaviorSubject('Left');
    public readonly dualshockButtonRight$ = new BehaviorSubject('Right');
    public readonly dualshockButtonTouchpad$ = new BehaviorSubject('Touchpad pressed');
    public readonly dualshockLeftStickXAxis$ = new BehaviorSubject('Left stick X-axis');
    public readonly dualshockLeftStickYAxis$ = new BehaviorSubject('Left stick Y-axis');
    public readonly dualshockRightStickXAxis$ = new BehaviorSubject('Right stick X-axis');
    public readonly dualshockRightStickYAxis$ = new BehaviorSubject('Right stick Y-axis');

    public readonly genericGamepad$ = new BehaviorSubject('Generic gamepad');
    public readonly genericGamepadAxis$ = new BehaviorSubject('Axis');
    public readonly genericGamepadButton$ = new BehaviorSubject('Button');
}
