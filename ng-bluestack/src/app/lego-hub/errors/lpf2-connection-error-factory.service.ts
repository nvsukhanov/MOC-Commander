import { Injectable } from '@angular/core';
import { Lpf2ConnectionError } from './lpf2-connection-error';
import { L10nService } from '../../l10n';

@Injectable()
export class Lpf2ConnectionErrorFactoryService {
    constructor(
        private l10nService: L10nService
    ) {
    }

    public createConnectionError(): Lpf2ConnectionError {
        return new Lpf2ConnectionError(this.l10nService.hubConnectionError$.value);
    }

    public createGattUnavailableError(): Lpf2ConnectionError {
        return new Lpf2ConnectionError(this.l10nService.hubGattUnavailable$.value);
    }

    public createConnectionCancelledByUserError(): Lpf2ConnectionError {
        return new Lpf2ConnectionError(this.l10nService.hubConnectionCancelled$.value);
    }

    public createGattConnectionError(): Lpf2ConnectionError {
        return new Lpf2ConnectionError(this.l10nService.hubGattConnectionError$.value);
    }
}
