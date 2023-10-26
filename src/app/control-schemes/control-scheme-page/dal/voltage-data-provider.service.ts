import { Injectable } from '@angular/core';
import { Observable, filter, interval, map, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { TranslocoService } from '@ngneat/transloco';
import { ATTACHED_IO_SELECTORS, AttachedIoModel } from '@app/store';

import { IVoltageWidgetDataProvider } from '../components';
import { IoTypeToL10nKeyService } from '../../../shared/components/io-type-to-l10n-key';

@Injectable()
export class VoltageDataProviderService implements IVoltageWidgetDataProvider {
    constructor(
        private readonly store: Store,
        private readonly ioTypeToL10nKeyService: IoTypeToL10nKeyService,
        private readonly translocoService: TranslocoService
    ) {
    }

    public getVoltage(
        hubId: string,
        portId: number
    ): Observable<number> {
        return interval(100).pipe(
            map(() => Math.round(Math.random() * 100))
        );
    }

    public getIoNameByHubAndPort(
        hubId: string,
        portId: number
    ): Observable<string> {
        return this.store.select(ATTACHED_IO_SELECTORS.selectIoAtPort({ hubId, portId })).pipe(
            filter((io): io is AttachedIoModel => !!io),
            map((io) => this.ioTypeToL10nKeyService.getL10nKey(io.ioType)),
            switchMap((l10nKey) => this.translocoService.selectTranslate(l10nKey))
        );
    }
}
