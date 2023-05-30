import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { NgForOf, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { Controller, CONTROLLER_SELECTORS } from '../../store';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
import { LetDirective, PushPipe } from '@ngrx/component';
import { ControllersListItemComponent } from '../controllers-list-item';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';

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
        MatCardModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControllersListComponent {
    public readonly connectedControllers$ = this.store.select(CONTROLLER_SELECTORS.selectAll);

    constructor(
        private readonly store: Store
    ) {
    }

    public controllerTrackById(
        index: number,
        controller: Controller
    ): string {
        return controller.id;
    }
}
