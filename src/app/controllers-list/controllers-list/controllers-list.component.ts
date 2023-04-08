import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { ControllersListItemComponent } from '../controllers-list-item';
import { MatMenuModule } from '@angular/material/menu';
import { KeyValuePipe, NgForOf, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { TranslocoModule } from '@ngneat/transloco';
import {
    ACTIONS_CONFIGURE_CONTROLLER,
    ControllerConnectionState,
    ControllerType,
    IState,
    SELECT_CONNECTED_CONTROLLERS,
    SELECT_CONTROLLER_CONNECTION_STATE
} from '../../store';
import { Store } from '@ngrx/store';
import { CONFIGURE_CONTROLLER_I18N_SCOPE } from '../../i18n';
import { MatIconModule } from '@angular/material/icon';
import { LetModule, PushModule } from '@ngrx/component';
import { MatListModule } from '@angular/material/list';

@Component({
    standalone: true,
    selector: 'app-controllers-list',
    templateUrl: './controllers-list.component.html',
    styleUrls: [ './controllers-list.component.scss' ],
    imports: [
        MatExpansionModule,
        MatButtonModule,
        ControllersListItemComponent,
        MatMenuModule,
        KeyValuePipe,
        MatOptionModule,
        NgForOf,
        TranslocoModule,
        MatIconModule,
        NgSwitch,
        PushModule,
        NgSwitchCase,
        NgIf,
        MatListModule,
        LetModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControllersListComponent {
    public readonly connectableControllers: Array<{ l10nKey: string, type: ControllerType }> = [
        { l10nKey: `${CONFIGURE_CONTROLLER_I18N_SCOPE}.typeGamepad`, type: ControllerType.GamePad },
        { l10nKey: `${CONFIGURE_CONTROLLER_I18N_SCOPE}.typeKeyboard`, type: ControllerType.Keyboard }
    ];

    public readonly controllerConnectionStates = ControllerConnectionState;

    public readonly controllerConnectionState$ = this.store.select(SELECT_CONTROLLER_CONNECTION_STATE);

    public readonly connectedControllers$ = this.store.select(SELECT_CONNECTED_CONTROLLERS);

    constructor(
        private readonly store: Store<IState>,
    ) {
    }

    public controllerTrackById(index: number, controller: { id: number }): number {
        return controller.id;
    }

    public addController(controllerType: ControllerType | null): void {
        switch (controllerType) {
            case ControllerType.GamePad:
                this.store.dispatch(ACTIONS_CONFIGURE_CONTROLLER.listenForGamepad());
                break;
            case ControllerType.Keyboard:
                this.store.dispatch(ACTIONS_CONFIGURE_CONTROLLER.keyboardConnected());
                break;
            case ControllerType.Unassigned:
            case null:
                return;
        }
    }

    public disconnectController(id: number): void {
        this.store.dispatch(ACTIONS_CONFIGURE_CONTROLLER.disconnectController());
    }

    public cancelAddController(): void {
        this.store.dispatch(ACTIONS_CONFIGURE_CONTROLLER.cancelListeningForGamepad());
    }
}
