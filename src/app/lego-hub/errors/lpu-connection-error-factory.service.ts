import { Injectable } from '@angular/core';
import { LpuConnectionError } from './lpu-connection-error';
import { L10nService } from '../../l10n';

@Injectable()
export class LpuConnectionErrorFactoryService {
    constructor(
        private l10nService: L10nService
    ) {
    }

    public createConnectionError(): LpuConnectionError {
        return new LpuConnectionError(this.l10nService.hubConnectionError$.value);
    }

    public createGattUnavailableError(): LpuConnectionError {
        return new LpuConnectionError(this.l10nService.hubGattUnavailable$.value);
    }

    public createConnectionCancelledByUserError(): LpuConnectionError {
        return new LpuConnectionError(this.l10nService.hubConnectionCancelled$.value);
    }

    public createGattConnectionError(): LpuConnectionError {
        return new LpuConnectionError(this.l10nService.hubGattConnectionError$.value);
    }
}
