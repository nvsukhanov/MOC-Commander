import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoPipe } from '@ngneat/transloco';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { PushPipe } from '@ngrx/component';
import { RoutesBuilderService } from '@app/shared-misc';

@Component({
    standalone: true,
    selector: 'feat-root-discover-hub-button',
    templateUrl: './discover-hub-button.component.html',
    styleUrls: [ './discover-hub-button.component.scss' ],
    imports: [
        NgIf,
        MatButtonModule,
        TranslocoPipe,
        MatIconModule,
        RouterLink,
        PushPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiscoverHubButtonComponent {
    @Input() public isBluetoothAvailable = false;

    @Input() public isDiscoveryBusy = false;

    @Input() public connectedHubsCount = 0;

    @Output() public readonly discoveryStart = new EventEmitter<void>();

    constructor(
        public readonly routesBuilderService: RoutesBuilderService,
    ) {
    }

    public onDiscoveryStart(): void {
        this.discoveryStart.next();
    }
}
