import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { NgForOf, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { Controller, CONTROLLER_SELECTORS, CONTROLLER_SETTINGS_ACTIONS, ControllerSettings } from '../../store';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
import { LetDirective, PushPipe } from '@ngrx/component';
import { ControllersListItemComponent } from '../controllers-list-item';
import { MatListModule } from '@angular/material/list';

@Component({
    standalone: true,
    selector: 'app-controllers-list',
    templateUrl: './controllers-list.component.html',
    styleUrls: [ './controllers-list.component.scss' ],
    imports: [
        MatExpansionModule,
        MatButtonModule,
        NgForOf,
        TranslocoModule,
        MatIconModule,
        NgSwitch,
        PushPipe,
        NgSwitchCase,
        NgIf,
        LetDirective,
        ControllersListItemComponent,
        MatListModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControllersListComponent {
    public readonly controllersWithSettings$ = this.store.select(CONTROLLER_SELECTORS.selectAllWithSettings);

    constructor(
        private readonly store: Store
    ) {
    }

    public controllerTrackById(
        index: number,
        controllerWithSettings: { controller: Controller, settings?: ControllerSettings }
    ): string {
        return controllerWithSettings.controller.id;
    }

    public controllerSettingsUpdate(
        controllerId: string,
        settings: ControllerSettings
    ): void {
        this.store.dispatch(
            CONTROLLER_SETTINGS_ACTIONS.updateSettings({
                settings: {
                    ...settings,
                    controllerId
                }
            })
        );
    }
}
