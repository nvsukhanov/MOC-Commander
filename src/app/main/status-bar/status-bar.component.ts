import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { CONFIGURE_HUB_I18N_SCOPE } from '../../i18n';

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
    providers: [
        { provide: TRANSLOCO_SCOPE, useValue: CONFIGURE_HUB_I18N_SCOPE, multi: true }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusBarComponent {
    @Input() public isControllerConnected: boolean | null = null;

    @Input() public isHubConnected: boolean | null = null;

    @Input() public batteryLevel: number | null = null;

    @Input() public rssiLevel: number | null = null;
}
