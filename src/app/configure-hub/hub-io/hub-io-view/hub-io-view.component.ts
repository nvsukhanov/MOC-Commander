import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IState, SELECT_IO_PORT_CONFIG } from '../../../store';
import { Store } from '@ngrx/store';
import { KeyValuePipe, NgForOf, NgIf } from '@angular/common';
import { LetModule, PushModule } from '@ngrx/component';
import { IoPortRendererDirective } from '../io-port-renderer.directive';

@Component({
    standalone: true,
    selector: 'app-hub-io-view',
    templateUrl: './hub-io-view.component.html',
    styleUrls: [ './hub-io-view.component.scss' ],
    imports: [
        NgForOf,
        PushModule,
        KeyValuePipe,
        LetModule,
        NgIf,
        IoPortRendererDirective
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubIoViewComponent {
    public readonly attachedIos$ = this.store.select(SELECT_IO_PORT_CONFIG);

    constructor(
        private readonly store: Store<IState>
    ) {
    }
}
