import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { ControllerTypeSelectComponent } from '../controller-type-select';
import {
    ACTIONS_CONFIGURE_CONTROLLER,
    ControllerConnectionState,
    ControllerType,
    IState,
    SELECT_CONTROLLER_CONFIG,
    SELECT_CONTROLLER_CONNECTION_STATE,
    SELECT_CONTROLLER_STATE,
    SELECT_CONTROLLER_TYPE
} from '../../store';
import { Store } from '@ngrx/store';
import { AsyncPipe, JsonPipe, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { MAPPING_CONTROLLER_TO_L10N } from '../../mappings';
import { filter, map } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { L10nPipe } from '../../l10n';
import { FormsModule } from '@angular/forms';
import { LetModule, PushModule } from '@ngrx/component';
import { ControllerGamepadViewComponent } from '../controller-gamepad-view';

@Component({
    standalone: true,
    selector: 'app-configure-controller',
    templateUrl: './configure-controller.component.html',
    styleUrls: [ './configure-controller.component.scss' ],
    imports: [
        ControllerTypeSelectComponent,
        NgIf,
        AsyncPipe,
        MatButtonModule,
        L10nPipe,
        NgSwitchCase,
        FormsModule,
        PushModule,
        NgSwitch,
        JsonPipe,
        LetModule,
        ControllerGamepadViewComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigureControllerComponent implements OnDestroy {
    public readonly controllerConnectionState$ = this.store.select(SELECT_CONTROLLER_CONNECTION_STATE);

    public readonly connectedControllerType$ = this.store.select(SELECT_CONTROLLER_TYPE);
    public readonly controllerTypes = ControllerType;
    public readonly controllerToL10nMap = MAPPING_CONTROLLER_TO_L10N;
    public readonly controllerTypeL10n$ = this.connectedControllerType$.pipe(
        filter((t) => t !== null),
        map((t) => this.controllerToL10nMap[t as ControllerType])
    );

    public readonly controllerConfig$ = this.store.select(SELECT_CONTROLLER_CONFIG);
    public readonly controllerState$ = this.store.select(SELECT_CONTROLLER_STATE);
    public readonly controllerConnectionStates = ControllerConnectionState;

    constructor(
        private readonly store: Store<IState>
    ) {
    }

    public ngOnDestroy(): void {
        this.store.dispatch(ACTIONS_CONFIGURE_CONTROLLER.cancelListeningForGamepad());
    }

    public isControllerTypeSelected(type: ControllerType | null): boolean {
        return type !== null && type !== ControllerType.Unassigned;
    }

    public onDisconnectController(index: number | null): void {
        if (index !== null) { // TODO: maybe we can avoid using null in the state
            this.store.dispatch(ACTIONS_CONFIGURE_CONTROLLER.disconnectGamepad({ index }));
        }
    }

    public cancelListening(): void {
        this.store.dispatch(ACTIONS_CONFIGURE_CONTROLLER.cancelListeningForGamepad());
    }

    public onControllerListeningStart(controllerType: ControllerType | null): void {
        switch (controllerType) {
            case ControllerType.GamePad:
                this.store.dispatch(ACTIONS_CONFIGURE_CONTROLLER.listenForGamepad());
                break;
            case ControllerType.Unassigned:
            case null:
                return;
        }
    }
}
