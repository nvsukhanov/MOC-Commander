import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { Store } from '@ngrx/store';
import { PushPipe } from '@ngrx/component';
import { SteamDeckManualComponent, WindowsInstallationManualComponent } from '@app/manuals';
import { BLUETOOTH_AVAILABILITY_SELECTORS } from '@app/store';

import { BluetoothUnavailableNotificationComponent } from '../bluetooth-unavailable-notification';

@Component({
    standalone: true,
    selector: 'feat-main',
    templateUrl: './main.component.html',
    styleUrls: [ './main.component.scss' ],
    imports: [
        SteamDeckManualComponent,
        MatAccordion,
        MatExpansionPanel,
        MatExpansionPanelTitle,
        MatExpansionPanelHeader,
        MatExpansionPanelDescription,
        WindowsInstallationManualComponent,
        PushPipe,
        BluetoothUnavailableNotificationComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent {
    public readonly isBluetoothAvailable$ = this.store.select(BLUETOOTH_AVAILABILITY_SELECTORS.isAvailable);

    constructor(
        private readonly store: Store
    ) {
    }
}
