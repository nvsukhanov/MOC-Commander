import { Observable, ReplaySubject, Subscription, take } from 'rxjs';
import { HUB_CHARACTERISTIC_UUID, HUB_SERVICE_UUID } from './constants';
import { CharacteristicDataStreamFactoryService, OutboundMessenger, OutboundMessengerFactoryService } from './messages';
import {
    HubPropertiesFeature,
    HubPropertiesFeatureFactoryService,
    IoFeature,
    IoFeatureFactoryService,
    MotorFeature,
    MotorFeatureFactoryService
} from './features';

export class Hub {
    public onDisconnected$: Observable<void>;

    private onDisconnected = new ReplaySubject<void>(1);

    private primaryService?: BluetoothRemoteGATTService;

    private primaryCharacteristic?: BluetoothRemoteGATTCharacteristic;

    private messenger?: OutboundMessenger;

    private hubDisconnectSubscription?: Subscription;

    private onUnloadHandler?: () => void;

    private _hubProperties?: HubPropertiesFeature;

    private _ports?: IoFeature;

    private _motor?: MotorFeature;

    constructor(
        private readonly onHubDisconnect: Observable<void>,
        private readonly gatt: BluetoothRemoteGATTServer,
        private readonly characteristicsMessengerFactoryService: OutboundMessengerFactoryService,
        private readonly propertiesFactoryService: HubPropertiesFeatureFactoryService,
        private readonly portInformationProviderFactoryService: IoFeatureFactoryService,
        private readonly characteristicsDataStreamFactoryService: CharacteristicDataStreamFactoryService,
        private readonly motorFeatureFactoryService: MotorFeatureFactoryService,
        private readonly window: Window
    ) {
        this.onDisconnected$ = this.onDisconnected;
    }

    public get hubProperties(): HubPropertiesFeature {
        if (!this._hubProperties) {
            throw new Error('not connected yet'); // TODO: meaningful error handling
        }
        return this._hubProperties;
    }

    public get ports(): IoFeature {
        if (!this._ports) {
            throw new Error('not connected yet'); // TODO: meaningful error handling
        }
        return this._ports;
    }

    public get motor(): MotorFeature {
        if (!this._motor) {
            throw new Error('not connected yet'); // TODO: meaningful error handling
        }
        return this._motor;
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

        this._ports = this.portInformationProviderFactoryService.create(
            dataStream,
            this.onHubDisconnect,
            this.messenger
        );

        this._motor = this.motorFeatureFactoryService.createMotorFeature(
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
