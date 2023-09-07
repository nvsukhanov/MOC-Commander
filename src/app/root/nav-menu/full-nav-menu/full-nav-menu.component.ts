import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslocoModule } from '@ngneat/transloco';
import { PushPipe } from '@ngrx/component';
import { NgIf } from '@angular/common';
import { RoutesBuilderService } from '@app/routing';
import { EllipsisTitleDirective } from '@app/shared';


@Component({
    standalone: true,
    selector: 'app-full-nav-menu',
    templateUrl: './full-nav-menu.component.html',
    styleUrls: [ './full-nav-menu.component.scss' ],
    imports: [
        RouterLink,
        RouterLinkActive,
        MatButtonModule,
        MatIconModule,
        MatToolbarModule,
        TranslocoModule,
        PushPipe,
        EllipsisTitleDirective,
        NgIf
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FullNavMenuComponent {
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
