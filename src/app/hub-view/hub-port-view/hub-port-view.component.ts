import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AttachedIO } from '../../store';
import { MatCardModule } from '@angular/material/card';
import { NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { IOTypeToI18nKey } from '../io-type-to-i18b-key.pipe';

@Component({
    standalone: true,
    selector: 'app-hub-port-view',
    templateUrl: './hub-port-view.component.html',
    styleUrls: [ './hub-port-view.component.scss' ],
    imports: [
        MatCardModule,
        NgIf,
        TranslocoModule,
        IOTypeToI18nKey,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubPortViewComponent {
    @Input() public io: AttachedIO | undefined;

}
