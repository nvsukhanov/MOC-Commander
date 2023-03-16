/// <reference types="web-bluetooth" />

import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { NAVIGATOR } from '../../types';
import { MatButtonModule } from '@angular/material/button';

@Component({
    standalone: true,
    selector: 'app-configure-hub-component',
    templateUrl: './configure-hub.component.html',
    styleUrls: [ './configure-hub.component.scss' ],
    imports: [
        MatButtonModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigureHubComponent {
    constructor(
        @Inject(NAVIGATOR) private readonly navigator: Navigator
    ) {
    }

    public async connect(): Promise<void> {
        const LPF2_HUB_SERVICE_UUID = '00001623-1212-EFDE-1623-785FEABCD123'.toLowerCase();
        const LPF2_SERVICE_CHARACTERISTIC = '00001624-1212-EFDE-1623-785FEABCD123'.toLowerCase();

        const p = await this.navigator.bluetooth.requestDevice({
            filters: [
                {
                    services: [
                        LPF2_HUB_SERVICE_UUID
                    ]
                }
            ],
            optionalServices: [
                'battery_service',
                'device_information'
            ]
        });
        console.log('discovery completed, connecting');
        console.log(p);
        if (p.gatt) {
            console.log('got gatt');
            const server = await p.gatt.connect();
            const service = await server.getPrimaryService(LPF2_HUB_SERVICE_UUID);
            const char = await service.getCharacteristics();
            console.log(char);
        }
    }
}
