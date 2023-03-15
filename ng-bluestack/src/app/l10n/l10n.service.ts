import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class L10nService {
    public readonly configureController$ = new BehaviorSubject('Configure controller');
    public readonly selectControllerType$ = new BehaviorSubject('Select controller type');

    public readonly controllerTypeUnassigned$ = new BehaviorSubject('Unassigned');
    public readonly controllerTypeGamepad$ = new BehaviorSubject('Gamepad');
    public readonly controllerDisconnect$ = new BehaviorSubject('Disconnect');
}
