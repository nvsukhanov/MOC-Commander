import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IState, SELECT_BLUETOOTH_AVAILABILITY } from '../store';
import { Store } from '@ngrx/store';
import { AsyncPipe, NgIf } from '@angular/common';
import { L10nPipe, L10nService } from '../l10n';

@Component({
    standalone: true,
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: [ './main.component.scss' ],
    imports: [
        NgIf,
        AsyncPipe,
        L10nPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent {
    public readonly bluetoothAvailability$ = this.store.select(SELECT_BLUETOOTH_AVAILABILITY);

    constructor(
        private store: Store<IState>,
        public readonly l10n: L10nService
    ) {
    }
}
