import { Injectable } from '@angular/core';
import { Observable, filter, map, of, switchMap, take, tap, throwError, timeout } from 'rxjs';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';

import { ATTACHED_IO_PROPS_SELECTORS, HUB_RUNTIME_DATA_SELECTORS } from '../selectors';
import { HUBS_ACTIONS } from '../actions';

@Injectable()
export class HubMotorPositionFacadeService {
  constructor(
    private readonly store: Store,
    private readonly actions: Actions,
  ) {}

  public setMotorPosition(hubId: string, portId: number, position: number): Observable<void> {
    return this.store.select(ATTACHED_IO_PROPS_SELECTORS.selectMotorEncoderOffset({ hubId, portId })).pipe(
      take(1),
      tap((motorEncoderOffset) =>
        this.store.dispatch(HUBS_ACTIONS.setPortPosition({ hubId, portId, position: position - motorEncoderOffset })),
      ),
      map(() => void 0),
    );
  }

  public getMotorAbsolutePosition(hubId: string, portId: number): Observable<number> {
    return this.store.select(HUB_RUNTIME_DATA_SELECTORS.canRequestPortValue({ hubId, portId })).pipe(
      take(1),
      switchMap((canRequest) => {
        if (!canRequest) {
          return throwError(() => new Error(`Cannot request port absolute position for ${hubId}/${portId}`));
        }
        this.store.dispatch(HUBS_ACTIONS.requestPortAbsolutePosition({ hubId, portId }));
        return this.actions.pipe(
          ofType(HUBS_ACTIONS.portAbsolutePositionRead, HUBS_ACTIONS.portAbsolutePositionReadFailed),
          filter((action) => action.portId === portId && action.hubId === hubId),
          timeout(1000),
          take(1),
          switchMap((action) => {
            if (action.type === HUBS_ACTIONS.portAbsolutePositionRead.type) {
              return of(action.position);
            }
            return throwError(() => action.error);
          }),
        );
      }),
    );
  }

  public getMotorPosition(hubId: string, portId: number): Observable<number> {
    return this.store.select(HUB_RUNTIME_DATA_SELECTORS.canRequestPortValue({ hubId, portId })).pipe(
      take(1),
      switchMap((canRequest) => {
        if (!canRequest) {
          return throwError(() => new Error('Cannot request port position'));
        }
        this.store.dispatch(HUBS_ACTIONS.requestPortPosition({ hubId, portId }));
        return this.actions.pipe(
          ofType(HUBS_ACTIONS.portPositionRead, HUBS_ACTIONS.portPositionReadFailed),
          filter((action) => action.portId === portId && action.hubId === hubId),
          timeout(1000),
          take(1),
          switchMap((action) => {
            if (action.type === HUBS_ACTIONS.portPositionRead.type) {
              return of(action.position);
            }
            return throwError(() => action.error);
          }),
        );
      }),
    );
  }
}
