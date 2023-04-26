import { Injectable } from '@angular/core';
import { LpuConnectionError } from './lpu-connection-error';
import { HubProperty } from '../constants';

@Injectable()
export class LpuConnectionErrorFactoryService {
    public createConnectionError(): LpuConnectionError {
        return new LpuConnectionError('Hub connection error', 'hubConnectionError');
    }

    public createUnableToGetPropertyError(property: HubProperty): LpuConnectionError {
        return new LpuConnectionError('Unable to get primary MAC address', 'hubErrorUnableToGetProperty', { property: HubProperty[property] });
    }

    public createInvalidPropertyValueError(property: HubProperty, value: number[] | number | string | string[]): LpuConnectionError {
        return new LpuConnectionError('Invalid property value', 'hubErrorInvalidPropertyValue', { property: HubProperty[property], value: value.toString() });
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
