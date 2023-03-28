import { Observable, ReplaySubject, Subscription, take } from 'rxjs';
import { HUB_CHARACTERISTIC_UUID, HUB_SERVICE_UUID } from './constants';
import { LpuCharacteristicsMessenger } from './lpu-characteristics-messenger';
import { LpuCharacteristicsMessengerFactoryService } from './lpu-characteristics-messenger-factory.service';
import { LpuHubPropertiesFactoryService } from './lpu-hub-properties-factory.service';
import { LpuHubProperties } from './lpu-hub-properties';

export class LpuHub {
    private onDisconnected = new ReplaySubject<void>(1);

    public onDisconnected$: Observable<void> = this.onDisconnected;

    private primaryService?: BluetoothRemoteGATTService;

    private primaryCharacteristic?: BluetoothRemoteGATTCharacteristic;

    private messenger?: LpuCharacteristicsMessenger;

    private hubDisconnectSubscription?: Subscription;

    private onUnloadHandler?: () => void;

    constructor(
        private readonly onHubDisconnect: Observable<void>,
        private readonly gatt: BluetoothRemoteGATTServer,
        private readonly characteristicsMessengerFactoryService: LpuCharacteristicsMessengerFactoryService,
        private readonly propertiesFactoryService: LpuHubPropertiesFactoryService,
        private readonly window: Window
    ) {
    }

    private _hubProperties?: LpuHubProperties;

    public get hubProperties(): LpuHubProperties {
        if (!this._hubProperties) {
            throw new Error('not connected yet'); // TODO: meaningful error handling
        }
        return this._hubProperties;
    }

    public async connect(): Promise<void> {
        this.primaryService = await this.gatt.getPrimaryService(HUB_SERVICE_UUID);
        this.primaryCharacteristic = await this.primaryService.getCharacteristic(HUB_CHARACTERISTIC_UUID);
        this.messenger = this.characteristicsMessengerFactoryService.create(this.primaryCharacteristic);
        this._hubProperties = this.propertiesFactoryService.create(
            this.onDisconnected,
            this.primaryCharacteristic,
            this.messenger
        );

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

        await this._hubProperties?.disconnect();
        this.hubDisconnectSubscription?.unsubscribe();
        this.gatt.disconnect();
    }
}
