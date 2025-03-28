import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { TranslocoPipe } from '@jsverse/transloco';

import { SteamDeckManualComponent } from '../steam-deck';
import { WindowsInstallationManualComponent } from '../windows';
import { LinuxInstallationManualComponent } from '../linux';

@Component({
    standalone: true,
    selector: 'lib-manuals-installation-manuals-list',
    templateUrl: './installation-manuals-list.component.html',
    styleUrl: './installation-manuals-list.component.scss',
    imports: [
        MatAccordion,
        MatExpansionPanel,
        TranslocoPipe,
        MatExpansionPanelTitle,
        SteamDeckManualComponent,
        WindowsInstallationManualComponent,
        MatExpansionPanelHeader,
        LinuxInstallationManualComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstallationManualsListComponent {

}
