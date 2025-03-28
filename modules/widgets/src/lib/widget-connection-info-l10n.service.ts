import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Observable, combineLatestWith, map, of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { WidgetType } from '@app/shared-misc';
import { IoTypeToL10nKeyService, PortIdToPortNameService } from '@app/shared-components';
import { ATTACHED_IO_SELECTORS, HUBS_SELECTORS } from '@app/store';

@Injectable()
export class WidgetConnectionInfoL10nService {
  private readonly widgetTypeToWidgetConnectionL10nKeyMap: { [k in WidgetType]?: string } = {
    [WidgetType.Voltage]: 'controlScheme.widgets.voltage.connectionInfo',
    [WidgetType.Temperature]: 'controlScheme.widgets.temperature.connectionInfo',
    [WidgetType.Pitch]: 'controlScheme.widgets.pitch.connectionInfo',
    [WidgetType.Yaw]: 'controlScheme.widgets.yaw.connectionInfo',
    [WidgetType.Roll]: 'controlScheme.widgets.roll.connectionInfo',
  };

  constructor(
    private readonly translocoService: TranslocoService,
    private readonly portMapperService: PortIdToPortNameService,
    private readonly store: Store,
    private readonly ioTypeToL10nKeyService: IoTypeToL10nKeyService,
  ) {}

  public getConnectionInfo(widgetType: WidgetType, hubId: string, portId: number): Observable<string> {
    const l10nKey = this.widgetTypeToWidgetConnectionL10nKeyMap[widgetType];
    if (!l10nKey) {
      return of('');
    }
    const hubName$ = this.store.select(HUBS_SELECTORS.selectHubName(hubId));
    const portName = this.portMapperService.mapPortId(portId);
    const ioName$ = this.store.select(ATTACHED_IO_SELECTORS.selectIoAtPort({ hubId, portId })).pipe(
      map((io) => this.ioTypeToL10nKeyService.getL10nKey(io?.ioType)),
      switchMap((ioNameL10nKey) => this.translocoService.selectTranslate(ioNameL10nKey)),
    );

    return hubName$.pipe(
      combineLatestWith(ioName$),
      map(([hubName, ioName]) => ({ hubName, portName, ioName })),
      switchMap((payload) => this.translocoService.selectTranslate(l10nKey, payload)),
    );
  }
}
