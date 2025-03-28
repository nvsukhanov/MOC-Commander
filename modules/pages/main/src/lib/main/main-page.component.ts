import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { BLUETOOTH_AVAILABILITY_SELECTORS } from '@app/store';

import { BluetoothUnavailableNotificationComponent } from '../bluetooth-unavailable-notification';

@Component({
  standalone: true,
  selector: 'page-main',
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
  imports: [BluetoothUnavailableNotificationComponent, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPageComponent {
  public readonly isBluetoothAvailable$ = this.store.select(BLUETOOTH_AVAILABILITY_SELECTORS.isAvailable);

  constructor(private readonly store: Store) {}
}
