import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';
import { NgIf } from '@angular/common';
import { MatLineModule } from '@angular/material/core';
import { RouterLink } from '@angular/router';
import { EllipsisTitleDirective } from '../../../common';
import { RoutesBuilderService } from '../../../routing';
import { HubConnectionState } from '../../../store';

@Component({
    standalone: true,
    selector: 'app-hubs-list-item',
    templateUrl: './hubs-list-item.component.html',
    styleUrls: [ './hubs-list-item.component.scss' ],
    imports: [
        MatButtonModule,
        MatIconModule,
        TranslocoModule,
        NgIf,
        MatLineModule,
        RouterLink,
        EllipsisTitleDirective
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubsListItemComponent {
    @Input() public name?: string;

    @Input() public batteryLevel: number | null = null;

    @Input() public rssiLevel: number | null = null;

    @Input() public isButtonPressed = false;

    @Input() public hasCommunication = false;

    @Input() public connectionState: HubConnectionState = HubConnectionState.Disconnected;

    @Output() public readonly disconnect = new EventEmitter<void>();

    @Output() public readonly forget = new EventEmitter<void>();

    private _hubViewHref: string[] = [];

    constructor(
        private routesBuilderService: RoutesBuilderService,
    ) {
    }

    public get isConnected(): boolean {
        return this.connectionState === HubConnectionState.Connected;
    }

    public get batteryLevelIcon(): string {
        if (this.batteryLevel === null) {
            return 'battery_unknown';
        }

        if (this.batteryLevel >= 90) {
            return 'battery_full';
        }
        if (this.batteryLevel >= 75) {
            return 'battery_6_bar';
        }
        if (this.batteryLevel >= 60) {
            return 'battery_5_bar';
        }
        if (this.batteryLevel >= 45) {
            return 'battery_4_bar';
        }
        if (this.batteryLevel >= 30) {
            return 'battery_3_bar';
        }
        if (this.batteryLevel >= 15) {
            return 'battery_2_bar';
        }
        return 'battery_0_bar';
    }

    public get rssiLevelIcon(): string {
        if (this.rssiLevel === null || this.rssiLevel >= 0) {
            return 'signal_wifi_statusbar_null';
        }
        if (this.rssiLevel <= -40) {
            return 'signal_wifi_4_bar';
        }
        if (this.rssiLevel <= -30) {
            return 'network_wifi_3_bar';
        }
        if (this.rssiLevel <= -20) {
            return 'network_wifi_2_bar';
        }
        if (this.rssiLevel <= -10) {
            return 'network_wifi_1_bar';
        }
        return 'signal_wifi_bad';
    }

    @Input()
    public set hubId(value: string | undefined) {
        if (value === undefined) {
            this._hubViewHref = [];
            return;
        } else {
            this._hubViewHref = this.routesBuilderService.hubView(value);
        }
    }

    public get hubViewHref(): string[] {
        return this._hubViewHref;
    }

    public onDisconnectClick(): void {
        this.disconnect.emit();
    }

    public onForgerClick(): void {
        this.forget.emit();
    }
}
