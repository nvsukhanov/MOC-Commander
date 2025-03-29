import { ChangeDetectionStrategy, Component, Input, Signal, WritableSignal, computed, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatCard, MatCardContent } from '@angular/material/card';
import { HubInlineViewComponent } from '@app/shared-components';

import { HUB_LIST_ITEM_SELECTORS } from './hub-list-item.selectors';
import { HubPortListItemComponent } from '../hub-port-list-item';

@Component({
  standalone: true,
  selector: 'page-control-scheme-view-hub-list-item',
  templateUrl: './hub-list-item.component.html',
  styleUrl: './hub-list-item.component.scss',
  imports: [HubInlineViewComponent, HubPortListItemComponent, MatCard, MatCardContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubListItemComponent {
  private _isHubKnown: Signal<boolean> = signal(false);

  private _hubName: Signal<string> = signal('');

  private _hubId: WritableSignal<string | null> = signal(null);

  private _batteryLevel: Signal<number | null> = signal(null);

  private _rssi: Signal<number | null> = signal(null);

  private _buttonState: Signal<boolean> = signal(false);

  private _hasCommunication: Signal<boolean> = signal(false);

  private _isConnected: Signal<boolean> = signal(false);

  private _controlSchemeName: WritableSignal<string | null> = signal(null);

  private _portIds: Signal<number[]> = computed(() => {
    const hubId = this._hubId();
    const controlSchemeName = this._controlSchemeName();
    if (hubId === null || controlSchemeName === null) {
      return [];
    }
    // we can do something like that, right? right?
    return this.store.selectSignal(HUB_LIST_ITEM_SELECTORS.selectControlSchemeHubPorts(controlSchemeName, hubId))();
  });

  constructor(private readonly store: Store) {}

  public get isHubKnown(): Signal<boolean> {
    return this._isHubKnown;
  }

  public get hubName(): Signal<string> {
    return this._hubName;
  }

  public get hubId(): Signal<string | null> {
    return this._hubId;
  }

  public get batteryLevel(): Signal<number | null> {
    return this._batteryLevel;
  }

  public get rssi(): Signal<number | null> {
    return this._rssi;
  }

  public get buttonState(): Signal<boolean> {
    return this._buttonState;
  }

  public get hasCommunication(): Signal<boolean> {
    return this._hasCommunication;
  }

  public get isConnected(): Signal<boolean> {
    return this._isConnected;
  }

  public get portIds(): Signal<number[]> {
    return this._portIds;
  }

  public get controlSchemeName(): Signal<string | null> {
    return this._controlSchemeName;
  }

  @Input()
  public set hubId(id: string | null) {
    this._hubId.set(id);
    this._isHubKnown =
      id === null ? signal(false) : this.store.selectSignal(HUB_LIST_ITEM_SELECTORS.selectIsHubKnown(id));
    this._hubName = id === null ? signal('') : this.store.selectSignal(HUB_LIST_ITEM_SELECTORS.selectHubName(id));
    this._batteryLevel =
      id === null ? signal(null) : this.store.selectSignal(HUB_LIST_ITEM_SELECTORS.selectBatteryLevel(id));
    this._rssi = id === null ? signal(null) : this.store.selectSignal(HUB_LIST_ITEM_SELECTORS.selectRssi(id));
    this._buttonState =
      id === null ? signal(false) : this.store.selectSignal(HUB_LIST_ITEM_SELECTORS.selectButtonState(id));
    this._hasCommunication =
      id === null ? signal(false) : this.store.selectSignal(HUB_LIST_ITEM_SELECTORS.selectHasCommunication(id));
    this._isConnected =
      id === null ? signal(false) : this.store.selectSignal(HUB_LIST_ITEM_SELECTORS.selectIsConnected(id));
  }

  @Input()
  public set controlSchemeName(controlSchemeName: string | null) {
    this._controlSchemeName.set(controlSchemeName);
  }
}
