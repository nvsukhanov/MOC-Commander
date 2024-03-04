import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { SteamDeckManualComponent, WindowsInstallationManualComponent } from '@app/manuals';
import { BLUETOOTH_AVAILABILITY_SELECTORS } from '@app/store';

import { BluetoothUnavailableNotificationComponent } from '../bluetooth-unavailable-notification';

@Component({
    standalone: true,
    selector: 'page-main',
    templateUrl: './main-page.component.html',
    styleUrls: [ './main-page.component.scss' ],
    imports: [
        SteamDeckManualComponent,
        MatAccordion,
        MatExpansionPanel,
        MatExpansionPanelTitle,
        MatExpansionPanelHeader,
        MatExpansionPanelDescription,
        WindowsInstallationManualComponent,
        BluetoothUnavailableNotificationComponent,
        AsyncPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainPageComponent {
    public readonly isBluetoothAvailable$ = this.store.select(BLUETOOTH_AVAILABILITY_SELECTORS.isAvailable);

    constructor(
        private readonly store: Store
    ) {
    }
}
