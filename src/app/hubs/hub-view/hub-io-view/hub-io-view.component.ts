import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';

import { IoTypeToL10nKeyPipe } from '@app/shared';
import { IoFullInfo, PortModeInfo } from '../../../store';

@Component({
    standalone: true,
    selector: 'app-hub-port-view',
    templateUrl: './hub-io-view.component.html',
    styleUrls: [ './hub-io-view.component.scss' ],
    imports: [
        MatCardModule,
        NgIf,
        TranslocoModule,
        IoTypeToL10nKeyPipe,
        NgForOf,
        MatIconModule,
        MatButtonModule,
        MatExpansionModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubIoViewComponent {
    @Input() public ioFullInfo: IoFullInfo | undefined;

    public portModeInfoTrackById(
        _: number,
        portModeInfo: PortModeInfo
    ): string {
        return portModeInfo.id;
    }
}
