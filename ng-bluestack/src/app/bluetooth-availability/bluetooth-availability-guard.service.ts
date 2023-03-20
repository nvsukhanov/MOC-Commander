import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IState, SELECT_BLUETOOTH_AVAILABILITY } from '../store';
import { map } from 'rxjs';

@Injectable()
export class BluetoothAvailabilityGuardService {
    public readonly guard$ = this.store.select(SELECT_BLUETOOTH_AVAILABILITY).pipe(
        map((v) => v ? true : this.router.parseUrl(''))
    );

    constructor(
        private readonly store: Store<IState>,
        private readonly router: Router
    ) {
    }

}
