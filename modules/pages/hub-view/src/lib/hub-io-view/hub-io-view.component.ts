import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { IoTypeToL10nKeyPipe, PortIdToPortNamePipe } from '@app/shared-components';

import { HubIoViewModel } from '../hub-view-page.selectors';

@Component({
  standalone: true,
  selector: 'page-hub-view-hub-port-view',
  templateUrl: './hub-io-view.component.html',
  styleUrl: './hub-io-view.component.scss',
  imports: [TranslocoPipe, IoTypeToL10nKeyPipe, MatIconModule, MatExpansionModule, PortIdToPortNamePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubIoViewComponent {
  @Input() public hubIoViewModel: HubIoViewModel | undefined;
}
