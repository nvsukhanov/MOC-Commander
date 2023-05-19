import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { KeyValuePipe, NgForOf, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { TranslocoModule } from '@ngneat/transloco';
import { GAMEPAD_SELECTORS, GamepadConfig } from '../../store';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
import { LetModule, PushModule } from '@ngrx/component';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FeatureContentContainerComponent, FeatureToolbarComponent } from '../../common';

@Component({
    standalone: true,
    selector: 'app-controllers-list',
    templateUrl: './controllers-list.component.html',
    styleUrls: [ './controllers-list.component.scss' ],
    imports: [
        MatExpansionModule,
        MatButtonModule,
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
        LetModule,
        MatToolbarModule,
        FeatureToolbarComponent,
        FeatureContentContainerComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControllersListComponent {
    public readonly connectedControllers$ = this.store.select(GAMEPAD_SELECTORS.selectAll);

    constructor(
        private readonly store: Store,
    ) {
    }

    public controllerTrackById(index: number, controller: GamepadConfig): string {
        return `${controller.name}/${controller.gamepadIndex}`;
    }
}
