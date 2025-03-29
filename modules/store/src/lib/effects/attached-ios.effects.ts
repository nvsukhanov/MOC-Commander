import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, takeUntil } from 'rxjs';
import { AttachIoEvent, AttachedIoAttachInboundMessage } from 'rxpoweredup';

import { HubStorageService } from '../hub-storage.service';
import { ATTACHED_IOS_ACTIONS, HUBS_ACTIONS } from '../actions';

@Injectable()
export class AttachedIOsEffects {
  public readonly listenAttachedIOs$ = createEffect(() => {
    return this.actions.pipe(
      ofType(HUBS_ACTIONS.connected),
      mergeMap((action) => {
        return this.hubStorage
          .get(action.hubId)
          .ports.onIoAttach({ eventTypes: [AttachIoEvent.Attached] })
          .pipe(
            takeUntil(this.hubStorage.get(action.hubId).disconnected),
            map((r) => {
              const attachMessage = r as AttachedIoAttachInboundMessage;
              return ATTACHED_IOS_ACTIONS.ioConnected({
                io: {
                  hubId: action.hubId,
                  portId: attachMessage.portId,
                  hardwareRevision: attachMessage.hardwareRevision,
                  softwareRevision: attachMessage.softwareRevision,
                  ioType: attachMessage.ioTypeId,
                },
              });
            }),
          );
      }),
    );
  });

  public readonly listenDetachedIOsReplies$ = createEffect(() => {
    return this.actions.pipe(
      ofType(HUBS_ACTIONS.connected),
      mergeMap((action) => {
        return this.hubStorage
          .get(action.hubId)
          .ports.onIoDetach()
          .pipe(
            takeUntil(this.hubStorage.get(action.hubId).disconnected),
            map((ioDetachEvent) =>
              ATTACHED_IOS_ACTIONS.ioDisconnected({ hubId: action.hubId, portId: ioDetachEvent.portId }),
            ),
          );
      }),
    );
  });

  constructor(
    private readonly actions: Actions,
    private readonly hubStorage: HubStorageService,
  ) {}
}
