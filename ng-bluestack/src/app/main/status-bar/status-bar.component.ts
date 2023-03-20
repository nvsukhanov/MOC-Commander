import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AsyncPipe, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { L10nPipe, L10nService } from '../../l10n';

@Component({
    standalone: true,
    selector: 'app-status-bar-component',
    templateUrl: './status-bar.component.html',
    styleUrls: [ './status-bar.component.scss' ],
    imports: [
        MatToolbarModule,
        AsyncPipe,
        MatChipsModule,
        L10nPipe,
        NgSwitch,
        NgSwitchCase,
        NgSwitchDefault
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusBarComponent {
    @Input() public isControllerConnected: boolean | null = null;
    @Input() public isHubConnected: boolean | null = null;

    public get controllerConnectedBadgeL10nKey(): keyof L10nService {
        return this.isControllerConnected ? 'controllerIsConnectedStatusChip$' : 'controllerIsNotConnectedStatusChip$';
    }

    public get hubConnectedBadgeL10nKey(): keyof L10nService {
        return this.isHubConnected ? 'hubIsConnectedStatusChip$' : 'hubIsNotConnectedStatusChip$';
    }
}
