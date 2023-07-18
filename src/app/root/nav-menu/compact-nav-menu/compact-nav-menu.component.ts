import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PushPipe } from '@ngrx/component';
import { TranslocoModule } from '@ngneat/transloco';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { EllipsisTitleDirective } from '@app/shared';
import { NgIf } from '@angular/common';

import { RoutesBuilderService } from '../../../routing';

@Component({
    standalone: true,
    selector: 'app-compact-nav-menu',
    templateUrl: './compact-nav-menu.component.html',
    styleUrls: [ './compact-nav-menu.component.scss' ],
    imports: [
        RouterLink,
        RouterLinkActive,
        MatBadgeModule,
        MatIconModule,
        MatButtonModule,
        TranslocoModule,
        PushPipe,
        MatToolbarModule,
        EllipsisTitleDirective,
        NgIf
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompactNavMenuComponent {
    @Input() public connectedControllersCount = 0;

    @Input() public connectedHubCount = 0;

    @Input() public controlSchemesCount = 0;

    @Input() public isBluetoothAvailable = false;

    @Input() public isDiscoveryBusy = true;

    @Output() public discoveryStart = new EventEmitter<void>();

    constructor(
        public readonly routesBuilderService: RoutesBuilderService,
    ) {
    }

    public onDiscoveryStart(): void {
        this.discoveryStart.next();
    }
}
