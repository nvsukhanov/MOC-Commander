import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { RoutesBuilderService } from '@app/shared-misc';

@Component({
  standalone: true,
  selector: 'app-discover-hub-button',
  templateUrl: './discover-hub-button.component.html',
  styleUrl: './discover-hub-button.component.scss',
  imports: [MatButtonModule, TranslocoPipe, MatIconModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscoverHubButtonComponent {
  @Input() public isBluetoothAvailable = false;

  @Input() public isDiscoveryBusy = false;

  @Input() public connectedHubsCount = 0;

  @Output() public readonly discoveryStart = new EventEmitter<void>();

  constructor(public readonly routesBuilderService: RoutesBuilderService) {}

  public onDiscoveryStart(): void {
    this.discoveryStart.next();
  }
}
