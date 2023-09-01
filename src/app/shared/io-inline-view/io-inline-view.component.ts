import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IOType } from 'rxpoweredup';
import { TranslocoModule } from '@ngneat/transloco';
import { NgIf } from '@angular/common';

import { EllipsisTitleDirective } from '../ellipsis-title.directive';
import { IoTypeToL10nKeyPipe } from '../io-type-to-l10n-key.pipe';
import { PortIdToPortNamePipe } from '../port-id-to-port-name.pipe';

@Component({
    standalone: true,
    selector: 'app-io-inline-view',
    templateUrl: './io-inline-view.component.html',
    styleUrls: [ './io-inline-view.component.scss' ],
    imports: [
        TranslocoModule,
        NgIf,
        IoTypeToL10nKeyPipe,
        EllipsisTitleDirective,
        PortIdToPortNamePipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IoInlineViewComponent {
    @Input() public portId: number | null = null;

    @Input() public ioType: IOType | null = null;

    @Input() public isConnected: boolean | null = null;
}
