import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { MatIconModule } from '@angular/material/icon';

import { ControlSchemeViewVirtualPortTreeNode } from '../../../../store';
import { IoTypeToL10nKeyPipe } from '@app/shared';

@Component({
    standalone: true,
    selector: 'app-virtual-port-tree-node',
    templateUrl: './virtual-port-tree-node.component.html',
    styleUrls: [ './virtual-port-tree-node.component.scss' ],
    imports: [
        NgIf,
        IoTypeToL10nKeyPipe,
        TranslocoModule,
        MatIconModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VirtualPortTreeNodeComponent {
    @Input() public data?: ControlSchemeViewVirtualPortTreeNode;
}
