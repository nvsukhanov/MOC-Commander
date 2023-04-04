import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IState, SELECT_ATTACHED_IOS } from '../../store';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { MAPPING_HUB_IO_TYPE_TO_L10N } from '../../mappings';
import { JsonPipe, NgForOf } from '@angular/common';
import { PushModule } from '@ngrx/component';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
    standalone: true,
    selector: 'app-hub-view',
    templateUrl: './hub-view.component.html',
    styleUrls: [ './hub-view.component.scss' ],
    imports: [
        NgForOf,
        PushModule,
        TranslocoModule,
        JsonPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubViewComponent {
    public readonly ioData$ = this.store.select(SELECT_ATTACHED_IOS).pipe(
        map((ios) => Object.entries(ios).map(([ portId, data ]) => ({
            portId: portId,
            l10nKey: MAPPING_HUB_IO_TYPE_TO_L10N[data.ioType],
            value: data.value,
            modes: {
                inputModes: data.inputModes,
                outputModes: data.outputModes,
            }
        })))
    );

    constructor(
        private readonly store: Store<IState>,
    ) {
    }
}
