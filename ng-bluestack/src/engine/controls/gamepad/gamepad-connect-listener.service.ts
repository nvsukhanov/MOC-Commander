import { Injectable } from '@angular/core';
import { fromEvent, map, Observable } from 'rxjs';

@Injectable()
export class GamepadConnectListener {
    public readonly gamepadConnect$: Observable<Gamepad> = fromEvent<GamepadEvent>(window, 'gamepadconnected').pipe(
        map((v) => v.gamepad)
    );
}
