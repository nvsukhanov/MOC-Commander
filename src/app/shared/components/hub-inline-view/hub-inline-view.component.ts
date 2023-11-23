import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoPipe } from '@ngneat/transloco';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

import { RoutesBuilderService } from '../../../routing';
import { EllipsisTitleDirective } from '../ellipsis-title.directive';
import { HideOnSmallScreenDirective } from '../hide-on-small-screen.directive';
import { InputActivityIndicatorComponent } from '../input-activity-indicator';

@Component({
    standalone: true,
    selector: 'app-hub-inline-view',
    templateUrl: './hub-inline-view.component.html',
    styleUrls: [ './hub-inline-view.component.scss' ],
    imports: [
        MatButtonModule,
        MatIconModule,
        TranslocoPipe,
        NgIf,
        RouterLink,
        EllipsisTitleDirective,
        HideOnSmallScreenDirective,
        InputActivityIndicatorComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubInlineViewComponent {
    @Input() public isHubKnown = true;

    @Input() public name?: string;

    @Input() public batteryLevel: number | null = null;

    @Input() public rssiLevel: number | null = null;

    @Input() public isButtonPressed = false;

    @Input() public hasCommunication = false;

    @Input() public isConnected = false;

    @Input() public showControls = true;

    @Output() public readonly disconnect = new EventEmitter<void>();

    @Output() public readonly forget = new EventEmitter<void>();

    private _hubViewHref: string[] = [];

    private _hubId: string | undefined;

    constructor(
        private routesBuilderService: RoutesBuilderService,
    ) {
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
    public set hubId(
        hubId: string | undefined
    ) {
        if (hubId === undefined) {
            this._hubViewHref = [];
        } else {
            this._hubViewHref = this.routesBuilderService.hubView(hubId);
        }
        this._hubId = hubId;
    }

    public get hubId(): string | undefined {
        return this._hubId;
    }

    public get hubViewHref(): string[] {
        return this._hubViewHref;
    }

    public onDisconnectClick(): void {
        this.disconnect.emit();
    }

    public onForgetClick(): void {
        this.forget.emit();
    }
}
