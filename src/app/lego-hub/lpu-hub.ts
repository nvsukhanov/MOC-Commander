import { from, Observable, shareReplay, switchMap, takeUntil } from 'rxjs';
import { LpuTree } from './constants';

export class LpuHub {
    private servicesMap: Map<string, BluetoothRemoteGATTService> = new Map();

    private primaryServiceDiscovery$ = from(this.gatt.getPrimaryService(LpuTree.services.primary.id)).pipe(
        shareReplay(),
        takeUntil(this.onDisconnect$)
    );

    private characteristicsDiscovery$ = from(this.primaryServiceDiscovery$).pipe(
        switchMap((service) => service.getCharacteristics()),
    );

    constructor(
        public readonly onDisconnect$: Observable<void>,
        private readonly gatt: BluetoothRemoteGATTServer,
    ) {
        // this.characteristicsDiscovery$.subscribe((v) => {
        //     console.log(v);
        // });
    }

    public disconnect(): void {
        this.gatt.disconnect();
    }
}
