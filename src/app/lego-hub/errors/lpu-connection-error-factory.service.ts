import { Injectable } from '@angular/core';
import { LpuConnectionError } from './lpu-connection-error';

@Injectable()
export class LpuConnectionErrorFactoryService {
    public createConnectionError(): LpuConnectionError {
        return new LpuConnectionError('Hub connection error', 'hubConnectionError');
    }

    public createGattUnavailableError(): LpuConnectionError {
        return new LpuConnectionError('Hub GATT is unavailable', 'hubGattUnavailable');
    }

    public createConnectionCancelledByUserError(): LpuConnectionError {
        return new LpuConnectionError('Hub connection has been cancelled by user"', 'hubConnectionCancelled');
    }

    public createGattConnectionError(): LpuConnectionError {
        return new LpuConnectionError('Hub GATT connection error', 'hubGattConnectionError');
    }
}
