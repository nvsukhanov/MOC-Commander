import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { RoutesBuilderService } from '@app/shared-misc';

import { DiscoverHubButtonComponent } from '../discover-hub-button';

@Component({
  standalone: true,
  selector: 'app-compact-nav-menu',
  templateUrl: './compact-nav-menu.component.html',
  styleUrl: './compact-nav-menu.component.scss',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatBadgeModule,
    MatIconModule,
    MatButtonModule,
    TranslocoPipe,
    MatToolbarModule,
    MatMenuModule,
    DiscoverHubButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompactNavMenuComponent {
  @Input() public connectedControllersCount = 0;

  @Input() public connectedHubCount = 0;

  @Input() public controlSchemesCount = 0;

  @Input() public isBluetoothAvailable = false;

  @Input() public isDiscoveryBusy = true;

  @Output() public readonly discoveryStart = new EventEmitter<void>();

  constructor(public readonly routesBuilderService: RoutesBuilderService) {}

  public onDiscoveryStart(): void {
    this.discoveryStart.next();
  }
}
