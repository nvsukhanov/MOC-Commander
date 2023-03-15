import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ControllerTypeSelectComponent } from '../controller-type-select';
import { IState, SELECT_CONTROLLER_CONFIG, SELECT_CONTROLLER_STATE, SELECT_CONTROLLER_TYPE, SELECT_IS_CONTROLLER_CONNECTED } from '../../store';
import { Store } from '@ngrx/store';
import { AsyncPipe, NgIf, NgSwitchCase } from '@angular/common';
import { MAPPING_CONTROLLER_TO_L10N } from '../../mappings/controller-type-to-l10n';
import { filter, map } from 'rxjs';
import { ControllerType } from '../../types';
import { MatButtonModule } from '@angular/material/button';
import { L10nPipe } from '../../l10n';

@Component({
    standalone: true,
    selector: 'app-connect-controller',
    templateUrl: './connect-controller.component.html',
    styleUrls: [ './connect-controller.component.scss' ],
    imports: [
        ControllerTypeSelectComponent,
        NgIf,
        AsyncPipe,
        MatButtonModule,
        L10nPipe,
        NgSwitchCase
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectControllerComponent {
    public readonly isControllerConnected$ = this.store.select(SELECT_IS_CONTROLLER_CONNECTED);

    public readonly connectedControllerType$ = this.store.select(SELECT_CONTROLLER_TYPE);
    public readonly controllerTypes = ControllerType;
    public readonly controllerToL10nMap = MAPPING_CONTROLLER_TO_L10N;
    public readonly controllerTypeL10n$ = this.connectedControllerType$.pipe(
        filter((t) => t !== null),
        map((t) => this.controllerToL10nMap[t as ControllerType])
    )
    public readonly controllerConfig$ = this.store.select(SELECT_CONTROLLER_CONFIG);
    public readonly controllerState$ = this.store.select(SELECT_CONTROLLER_STATE);

    constructor(
        private readonly store: Store<IState>
    ) {
    }
}
