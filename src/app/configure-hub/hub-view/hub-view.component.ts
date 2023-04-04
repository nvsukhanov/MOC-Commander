import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IState } from '../../store';
import { Store } from '@ngrx/store';
import { JsonPipe, NgForOf } from '@angular/common';
import { PushModule } from '@ngrx/component';
import { TranslocoModule } from '@ngneat/transloco';
import { HubIoViewComponent } from '../hub-io';

@Component({
    standalone: true,
    selector: 'app-hub-view',
    templateUrl: './hub-view.component.html',
    styleUrls: [ './hub-view.component.scss' ],
    imports: [
        NgForOf,
        PushModule,
        TranslocoModule,
        JsonPipe,
        HubIoViewComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubViewComponent {
    constructor(
        private readonly store: Store<IState>,
    ) {
    }
}
