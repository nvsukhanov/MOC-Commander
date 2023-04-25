import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AttachedIO } from '../../../store';
import { MatCardModule } from '@angular/material/card';
import { NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { IoTypeToL10nKeyPipe } from '../../../mappings';

@Component({
    standalone: true,
    selector: 'app-hub-port-view',
    templateUrl: './hub-port-view.component.html',
    styleUrls: [ './hub-port-view.component.scss' ],
    imports: [
        MatCardModule,
        NgIf,
        TranslocoModule,
        IoTypeToL10nKeyPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubPortViewComponent {
    @Input() public io: AttachedIO | undefined;

}
