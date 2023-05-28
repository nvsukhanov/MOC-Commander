import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IOFullInfo, PortModeInfo } from '../../../store';
import { MatCardModule } from '@angular/material/card';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { IoTypeToL10nKeyPipe } from '../../../i18n';
import { hubPortModeInfoIdFn } from '../../../store/entity-adapters';

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
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubIoViewComponent {
    @Input() public ioFullInfo: IOFullInfo | undefined;

    public portModeInfoTrackById(
        _: number,
        portModeInfo: PortModeInfo
    ): string {
        return hubPortModeInfoIdFn(portModeInfo);
    }
}
