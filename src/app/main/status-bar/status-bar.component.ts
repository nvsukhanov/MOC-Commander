import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AsyncPipe, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { L10nPipe, L10nService } from '../../l10n';
import { Observable, of } from 'rxjs';

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
        NgSwitchDefault,
        NgIf,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusBarComponent {
    @Input() public isControllerConnected: boolean | null = null;

    @Input() public isHubConnected: boolean | null = null;

    constructor(
        private readonly l10nService: L10nService
    ) {
    }

    private _batteryLevel: Observable<string> = this.l10nService.hubPropertyDataNotAvailable$;

    @Input()
    public set batteryLevel(v: null | number) {
        this._batteryLevel = v === null ? this.l10nService.hubPropertyDataNotAvailable$ : of(v.toString());
    }

    private _rssiLevel: Observable<string> = this.l10nService.hubPropertyDataNotAvailable$;

    @Input()
    public set rssiLevel(v: null | number) {
        this._rssiLevel = v === null ? this.l10nService.hubPropertyDataNotAvailable$ : of(v.toString());
    }

    public get controllerConnectedBadgeL10nKey(): keyof L10nService {
        return this.isControllerConnected ? 'controllerIsConnectedStatusChip$' : 'controllerIsNotConnectedStatusChip$';
    }

    public get hubConnectedBadgeL10nKey(): keyof L10nService {
        return this.isHubConnected ? 'hubIsConnectedStatusChip$' : 'hubIsNotConnectedStatusChip$';
    }

    public get batteryLevel$(): Observable<string> {
        return this._batteryLevel;
    }

    public get rssiLevel$(): Observable<string> {
        return this._rssiLevel;
    }
}
