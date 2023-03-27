import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
    standalone: true,
    selector: 'app-status-bar-component',
    templateUrl: './status-bar.component.html',
    styleUrls: [ './status-bar.component.scss' ],
    imports: [
        MatToolbarModule,
        MatChipsModule,
        NgSwitch,
        NgSwitchCase,
        NgSwitchDefault,
        NgIf,
        TranslocoModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusBarComponent {
    @Input() public isControllerConnected: boolean | null = null;

    @Input() public isHubConnected: boolean | null = null;

    @Input() public batteryLevel: number | null = null;

    @Input() public rssiLevel: number | null = null;
}
