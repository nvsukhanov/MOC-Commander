import { Observable, ReplaySubject, Subscription, take } from 'rxjs';
import { HUB_CHARACTERISTIC_UUID, HUB_SERVICE_UUID } from './constants';
import {
    AttachedIoFeature,
    AttachedIoFeatureFactoryService,
    CharacteristicDataStreamFactoryService,
    HubPropertiesFeature,
    HubPropertiesFeatureFactoryService,
    OutboundMessenger,
    OutboundMessengerFactoryService,
    PortsFeature,
    PortsFeatureFactoryService
} from './messages';

export class Hub {
    private onDisconnected = new ReplaySubject<void>(1);

    public onDisconnected$: Observable<void> = this.onDisconnected;

    private primaryService?: BluetoothRemoteGATTService;

    private primaryCharacteristic?: BluetoothRemoteGATTCharacteristic;

    private messenger?: OutboundMessenger;

    private hubDisconnectSubscription?: Subscription;

    private onUnloadHandler?: () => void;

    constructor(
        private readonly onHubDisconnect: Observable<void>,
        private readonly gatt: BluetoothRemoteGATTServer,
        private readonly characteristicsMessengerFactoryService: OutboundMessengerFactoryService,
        private readonly propertiesFactoryService: HubPropertiesFeatureFactoryService,
        private readonly attachedIoProviderFactoryService: AttachedIoFeatureFactoryService,
        private readonly portInformationProviderFactoryService: PortsFeatureFactoryService,
        private readonly characteristicsDataStreamFactoryService: CharacteristicDataStreamFactoryService,
        private readonly window: Window
    ) {
    }

    private _hubProperties?: HubPropertiesFeature;

    public get hubProperties(): HubPropertiesFeature {
        if (!this._hubProperties) {
            throw new Error('not connected yet'); // TODO: meaningful error handling
        }
        return this._hubProperties;
    }

    private _attachedIO?: AttachedIoFeature;

    public get attachedIO(): AttachedIoFeature {
        if (!this._attachedIO) {
            throw new Error('not connected yet'); // TODO: meaningful error handling
        }
        return this._attachedIO;
    }

    private _ports?: PortsFeature;

    public get ports(): PortsFeature {
        if (!this._ports) {
            throw new Error('not connected yet'); // TODO: meaningful error handling
        }
        return this._ports;
    }

    public async connect(): Promise<void> {
        this.primaryService = await this.gatt.getPrimaryService(HUB_SERVICE_UUID);
        this.primaryCharacteristic = await this.primaryService.getCharacteristic(HUB_CHARACTERISTIC_UUID);
        this.messenger = this.characteristicsMessengerFactoryService.create(this.primaryCharacteristic);
        const dataStream = this.characteristicsDataStreamFactoryService.create(this.primaryCharacteristic);

        this._hubProperties = this.propertiesFactoryService.create(
            dataStream,
            this.onDisconnected,
            this.messenger,
        );

        this._attachedIO = this.attachedIoProviderFactoryService.create(
            dataStream,
            this.onHubDisconnect,
        );

        this._ports = this.portInformationProviderFactoryService.create(
            dataStream,
            this.onHubDisconnect,
            this.messenger
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
}
