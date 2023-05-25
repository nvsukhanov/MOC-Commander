import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { NgForOf, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { GAMEPAD_SELECTORS, GamepadConfig } from '../../store';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
import { LetDirective, PushPipe } from '@ngrx/component';

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
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControllersListComponent {
    public readonly connectedControllers$ = this.store.select(GAMEPAD_SELECTORS.selectAll);

    constructor(
        private readonly store: Store
    ) {
    }

    public controllerTrackById(index: number, controller: GamepadConfig): string {
        return `${controller.name}/${controller.gamepadIndex}`;
    }
}
