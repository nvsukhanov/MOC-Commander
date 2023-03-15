import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class L10nService {
    public readonly configureController$ = new BehaviorSubject('Configure controller');
    public readonly selectControllerType$ = new BehaviorSubject('Select controller type');

    public readonly keyboardController$ = new BehaviorSubject('Keyboard');
    public readonly gamepadController$ = new BehaviorSubject('Gamepad');
}
