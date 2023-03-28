import { EMPTY, fromEvent, map, Observable, of, ReplaySubject, Subscription, switchMap, take } from 'rxjs';
import { HUB_CHARACTERISTIC_UUID, HUB_SERVICE_UUID } from './constants';
import { HubCharacteristicsMessenger } from './hub-characteristics-messenger';
import { HubCharacteristicsMessengerFactoryService } from './hub-characteristics-messenger-factory.service';
import { HubPropertyProviderFactoryService } from './hub-property-provider-factory.service';
import { HubPropertyProvider } from './hub-property-provider';
import { HubAttachedIoProviderFactoryService } from './hub-attached-io-provider-factory.service';
import { HubAttachedIoProvider } from './hub-attached-io-provider';

export class Hub {
    private onDisconnected = new ReplaySubject<void>(1);

    public onDisconnected$: Observable<void> = this.onDisconnected;

    private primaryService?: BluetoothRemoteGATTService;

    private primaryCharacteristic?: BluetoothRemoteGATTCharacteristic;

    private messenger?: HubCharacteristicsMessenger;

    private hubDisconnectSubscription?: Subscription;

    private onUnloadHandler?: () => void;

    private readonly characteristicValueChangedEventName = 'characteristicvaluechanged';

    constructor(
        private readonly onHubDisconnect: Observable<void>,
        private readonly gatt: BluetoothRemoteGATTServer,
        private readonly characteristicsMessengerFactoryService: HubCharacteristicsMessengerFactoryService,
        private readonly propertiesFactoryService: HubPropertyProviderFactoryService,
        private readonly attachedIoProviderFactoryService: HubAttachedIoProviderFactoryService,
        private readonly window: Window
    ) {
    }

    private _hubProperties?: HubPropertyProvider;

    public get hubProperties(): HubPropertyProvider {
        if (!this._hubProperties) {
            throw new Error('not connected yet'); // TODO: meaningful error handling
        }
        return this._hubProperties;
    }

    private _hubAttachedIO?: HubAttachedIoProvider;

    public get hubAttachedIO(): HubAttachedIoProvider {
        if (!this._hubAttachedIO) {
            throw new Error('not connected yet'); // TODO: meaningful error handling
        }
        return this._hubAttachedIO;
    }

    public async connect(): Promise<void> {
        this.primaryService = await this.gatt.getPrimaryService(HUB_SERVICE_UUID);
        this.primaryCharacteristic = await this.primaryService.getCharacteristic(HUB_CHARACTERISTIC_UUID);
        this.messenger = this.characteristicsMessengerFactoryService.create(this.primaryCharacteristic);
        const characteristicDataStream$ = fromEvent(this.primaryCharacteristic, this.characteristicValueChangedEventName).pipe(
            map((e) => this.getValueFromEvent(e)),
            switchMap((value) => value ? of(value) : EMPTY)
        );
        this._hubProperties = this.propertiesFactoryService.create(
            this.onDisconnected,
            this.messenger,
            characteristicDataStream$
        );
        this._hubAttachedIO = this.attachedIoProviderFactoryService.create(
            this.onHubDisconnect,
            characteristicDataStream$
        );
        await this.primaryCharacteristic.startNotifications();

        this.hubDisconnectSubscription = this.onHubDisconnect.pipe(
            take(1)
        ).subscribe(() => {
            this.onDisconnected.next();
        });
        this.onUnloadHandler = (): void => {
            this.gatt.disconnect();
        };
        this.window.addEventListener('beforeunload', this.onUnloadHandler);
    }

    public async dispose(): Promise<void> {
        if (this.onUnloadHandler) {
            this.window.removeEventListener('beforeunload', this.onUnloadHandler);
        }

        await this.primaryCharacteristic?.stopNotifications();
        await this._hubProperties?.disconnect();
        this.hubDisconnectSubscription?.unsubscribe();
        this.gatt.disconnect();
    }

    private getValueFromEvent(event: Event): null | Uint8Array {
        const buffer = (event.target as BluetoothRemoteGATTCharacteristic).value?.buffer;
        if (!buffer) {
            return null;
        }
        return new Uint8Array(buffer);
    }
}
