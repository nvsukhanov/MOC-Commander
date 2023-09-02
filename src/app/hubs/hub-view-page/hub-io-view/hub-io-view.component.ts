import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { AttachedIoPortModeInfoModel } from '@app/store';
import { IoTypeToL10nKeyPipe, PortIdToPortNamePipe } from '@app/shared';

import { HubIoViewModel } from '../hub-view-page.selectors';

@Component({
    standalone: true,
    selector: 'app-hub-port-view',
    templateUrl: './hub-io-view.component.html',
    styleUrls: [ './hub-io-view.component.scss' ],
    imports: [
        NgIf,
        TranslocoModule,
        IoTypeToL10nKeyPipe,
        NgForOf,
        MatIconModule,
        MatExpansionModule,
        PortIdToPortNamePipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubIoViewComponent {
    @Input() public hubIoViewModel: HubIoViewModel | undefined;

    public portModeInfoTrackById(
        _: number,
        portModeInfo: AttachedIoPortModeInfoModel
    ): string {
        return portModeInfo.id;
    }
}
