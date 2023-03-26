import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class L10nService {
    public readonly bluetoothIsNotAvailable$ = new BehaviorSubject('Bluetooth is not available');

    public readonly configureController$ = new BehaviorSubject('Configure controller');

    public readonly configureHub$ = new BehaviorSubject('Configure hub');

    public readonly selectControllerType$ = new BehaviorSubject('Select controller type');

    public readonly connectToController$ = new BehaviorSubject('Connect');

    public readonly cancelListeningForController$ = new BehaviorSubject('Cancel listening');

    public readonly controllerTypeUnassigned$ = new BehaviorSubject('Unassigned');

    public readonly controllerTypeGamepad$ = new BehaviorSubject('Gamepad');

    public readonly controllerTypeKeyboard$ = new BehaviorSubject('Keyboard');

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

    public readonly xbox360Name$ = new BehaviorSubject('XBox 360'); // TODO: move to corresponding plugin

    public readonly xbox360LB$ = new BehaviorSubject('L1');

    public readonly xbox360RT$ = new BehaviorSubject('RT');

    public readonly xbox360RB$ = new BehaviorSubject('R1');

    public readonly xbox360LT$ = new BehaviorSubject('LT');

    public readonly xbox360ButtonA$ = new BehaviorSubject('A');

    public readonly xbox360ButtonB$ = new BehaviorSubject('B');

    public readonly xbox360ButtonX$ = new BehaviorSubject('X');

    public readonly xbox360ButtonY$ = new BehaviorSubject('Y');

    public readonly xbox360ButtonLeftStick$ = new BehaviorSubject('Left stick press');

    public readonly xbox360ButtonRightStick$ = new BehaviorSubject('Right stick press');

    public readonly xbox360ButtonShare$ = new BehaviorSubject('Share');

    public readonly xbox360ButtonMenu$ = new BehaviorSubject('Menu');

    public readonly xbox360ButtonUp$ = new BehaviorSubject('Up');

    public readonly xbox360ButtonDown$ = new BehaviorSubject('Down');

    public readonly xbox360ButtonLeft$ = new BehaviorSubject('Left');

    public readonly xbox360ButtonRight$ = new BehaviorSubject('Right');

    public readonly xbox360LeftStickXAxis$ = new BehaviorSubject('Left stick X-axis');

    public readonly xbox360LeftStickYAxis$ = new BehaviorSubject('Left stick Y-axis');

    public readonly xbox360RightStickXAxis$ = new BehaviorSubject('Right stick X-axis');

    public readonly xbox360RightStickYAxis$ = new BehaviorSubject('Right stick Y-axis');

    public readonly genericGamepad$ = new BehaviorSubject('Generic gamepad');

    public readonly genericGamepadAxis$ = new BehaviorSubject('Axis');

    public readonly genericGamepadButton$ = new BehaviorSubject('Button');

    public readonly hubConnectionError$ = new BehaviorSubject('Hub connection error');

    public readonly hubGattUnavailable$ = new BehaviorSubject('Hub GATT is not available');

    public readonly hubGattConnectionError$ = new BehaviorSubject('Hub GATT connection failed');

    public readonly hubConnectionCancelled$ = new BehaviorSubject('Hub connection was cancelled by user');

    public readonly hubDisconnected$ = new BehaviorSubject('Hub has been disconnected');

    public readonly hubDisconnect$ = new BehaviorSubject('Disconnect hub');

    public readonly hubIsConnected$ = new BehaviorSubject('Connected!');

    public readonly controllerIsConnectedStatusChip$ = new BehaviorSubject('Controller connected');

    public readonly controllerIsNotConnectedStatusChip$ = new BehaviorSubject('Controller is not connected');

    public readonly hubIsConnectedStatusChip$ = new BehaviorSubject('Hub connected');

    public readonly hubIsConnectingStatusChip$ = new BehaviorSubject('Connecting hub');

    public readonly hubIsDisconnectingStatusChip$ = new BehaviorSubject('Disconnecting hub');

    public readonly hubIsNotConnectedStatusChip$ = new BehaviorSubject('Hub is not connected');

    public readonly batteryLevel$ = new BehaviorSubject('Battery:');

    public readonly rssiLevel$ = new BehaviorSubject('Signal strength:');

    public readonly hubPropertyDataNotAvailable$ = new BehaviorSubject('...');
}
