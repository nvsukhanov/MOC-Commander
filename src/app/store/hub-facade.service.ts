import { Injectable } from '@angular/core';
import { Observable, of, switchMap, take, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';

import { HUB_STATS_SELECTORS } from './selectors';
import { HUBS_ACTIONS } from './actions';

@Injectable()
export class HubFacadeService {
    constructor(
        private readonly store: Store,
        private readonly actions: Actions
    ) {
    }

    public getMotorAbsolutePosition(
        hubId: string,
        portId: number
    ): Observable<number> {
        return this.store.select(HUB_STATS_SELECTORS.canRequestPortValue({ hubId, portId })).pipe(
            take(1),
            switchMap((canRequest) => {
                    if (!canRequest) {
                        return throwError(() => new Error('Cannot request port absolute position'));
                    }
                    this.store.dispatch(HUBS_ACTIONS.requestPortAbsolutePosition({ hubId, portId }));
                    return this.actions.pipe(
                        ofType(HUBS_ACTIONS.portAbsolutePositionRead, HUBS_ACTIONS.portAbsolutePositionReadFailed),
                        take(1),
                        switchMap((action) => {
                            if (action.type === HUBS_ACTIONS.portAbsolutePositionRead.type) {
                                return of(action.position);
                            }
                            return throwError(() => action.error);
                        })
                    );
                }
            ));
    }

    public getMotorPosition(
        hubId: string,
        portId: number
    ): Observable<number> {
        return this.store.select(HUB_STATS_SELECTORS.canRequestPortValue({ hubId, portId })).pipe(
            take(1),
            switchMap((canRequest) => {
                    if (!canRequest) {
                        return throwError(() => new Error('Cannot request port position'));
                    }
                    this.store.dispatch(HUBS_ACTIONS.requestPortPosition({ hubId, portId }));
                    return this.actions.pipe(
                        ofType(HUBS_ACTIONS.portPositionRead, HUBS_ACTIONS.portPositionReadFailed),
                        take(1),
                        switchMap((action) => {
                            if (action.type === HUBS_ACTIONS.portPositionRead.type) {
                                return of(action.position);
                            }
                            return throwError(() => action.error);
                        })
                    );
                }
            ));
    }
}
