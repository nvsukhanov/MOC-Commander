import { Inject, Injectable } from '@angular/core';
import { Hub } from './hub';
import { from, fromEvent, map, NEVER, Observable, shareReplay, Subject, take, takeUntil, tap } from 'rxjs';
import { CharacteristicDataStreamFactoryService, OutboundMessengerFactoryService } from './messages';
import { HubPropertiesFeatureFactoryService, IoFeatureFactoryService, MotorFeatureFactoryService } from './features';
import { HUB_CHARACTERISTIC_UUID, HUB_SERVICE_UUID } from './constants';
import { ILegoHubConfig, LEGO_HUB_CONFIG } from './i-lego-hub-config';
import { LpuConnectionErrorFactoryService } from './errors';
import { HubLoggerFactoryService } from './logging';
import { ILogger } from '../logging';

export type BluetoothDeviceWithGatt = Omit<BluetoothDevice, 'gatt'> & {
    readonly gatt: BluetoothRemoteGATTServer;
};

@Injectable()
export class HubFactoryService {
    private readonly gattServerDisconnectEventName = 'gattserverdisconnected';

    constructor(
        private readonly outboundMessengerFactoryService: OutboundMessengerFactoryService,
        private readonly propertiesFactoryService: HubPropertiesFeatureFactoryService,
        private readonly ioFeatureFactoryService: IoFeatureFactoryService,
        private readonly characteristicsDataStreamFactoryService: CharacteristicDataStreamFactoryService,
        private readonly motorFeatureFactoryService: MotorFeatureFactoryService,
        @Inject(LEGO_HUB_CONFIG) private readonly config: ILegoHubConfig,
        private readonly lpuConnectionErrorFactoryService: LpuConnectionErrorFactoryService,
        private readonly hubLoggerFactory: HubLoggerFactoryService
    ) {
    }

    public async connectToHub(
        device: BluetoothDeviceWithGatt,
        externalDisconnectEvents$: Observable<unknown> = NEVER
    ): Promise<Hub> {
        const hubLogger = this.hubLoggerFactory.createHubLogger(device.name ?? device.id);
        hubLogger.debug('Connecting to GATT server');
        const gatt = await this.connectGattServer(device);
        hubLogger.debug('Connected to GATT server');
        let primaryCharacteristic: BluetoothRemoteGATTCharacteristic;
        try {
            const primaryService = await gatt.getPrimaryService(HUB_SERVICE_UUID);
            hubLogger.debug('Got primary service');
            primaryCharacteristic = await primaryService.getCharacteristic(HUB_CHARACTERISTIC_UUID);
            hubLogger.debug('Got primary characteristic');
            return await this.createHub(hubLogger, primaryCharacteristic, device, externalDisconnectEvents$);
        } catch (e) {
            if (e instanceof Error) {
                hubLogger.debug('Disconnecting from gatt due to error');
                hubLogger.error(e);
            }
            gatt.disconnect();
            throw this.lpuConnectionErrorFactoryService.createConnectionError();
        }
    }

    private async createHub(
        hubLogger: ILogger,
        primaryCharacteristic: BluetoothRemoteGATTCharacteristic,
        device: BluetoothDeviceWithGatt,
        externalDisconnectEvents$: Observable<unknown> = NEVER
    ): Promise<Hub> {
        const gattDisconnected$ = fromEvent(device, this.gattServerDisconnectEventName).pipe(
            tap(() => hubLogger.debug('GATT server disconnected')),
            map(() => void 0),
            shareReplay({ bufferSize: 1, refCount: true })
        );

        const beforeDisconnect$ = new Subject<void>();

        const messenger = this.outboundMessengerFactoryService.create(primaryCharacteristic, hubLogger);
        const dataStream = this.characteristicsDataStreamFactoryService.create(primaryCharacteristic, hubLogger);

        const ioFeature = this.ioFeatureFactoryService.create(
            dataStream,
            gattDisconnected$,
            messenger
        );

        const propertiesFeature = this.propertiesFactoryService.create(
            dataStream,
            gattDisconnected$,
            messenger,
            hubLogger
        );

        const motorFeature = this.motorFeatureFactoryService.createMotorFeature(
            messenger
        );

        await primaryCharacteristic.startNotifications();
        hubLogger.debug('Started primary characteristic notifications');

        const hubDisconnectMethod: () => Observable<void> = () => {
            hubLogger.debug('Disconnection invoked');
            beforeDisconnect$.next();
            return from(primaryCharacteristic.stopNotifications()).pipe(
                map(() => void 0),
                tap(() => {
                    hubLogger.debug('Stopped primary characteristic notifications');
                    device.gatt.disconnect();
                    hubLogger.debug('Disconnected from GATT server');
                }),
                take(1)
            );
        };

        const externalDisconnectSubscription = externalDisconnectEvents$.pipe(
            takeUntil(gattDisconnected$),
            take(1)
        ).subscribe(() => {
            hubLogger.debug('External disconnect event received');
            externalDisconnectSubscription.unsubscribe();
            hubDisconnectMethod();
        });

        return new Hub(
            device.id,
            device.name,
            propertiesFeature,
            ioFeature,
            motorFeature,
            beforeDisconnect$,
            gattDisconnected$,
            hubDisconnectMethod
        );
    }

    private async connectGattServer(device: BluetoothDeviceWithGatt): Promise<BluetoothRemoteGATTServer> {
        let gatt: BluetoothRemoteGATTServer | null = null;

        for (let i = 0; i < this.config.maxGattConnectRetries && !gatt; i++) {
            gatt = await device.gatt.connect().catch(() => null);
        }
        if (!gatt) {
            throw this.lpuConnectionErrorFactoryService.createGattConnectionError();
        }
        return gatt;
    }
}
