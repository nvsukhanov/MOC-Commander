import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

import { IoInlineViewComponent } from '@app/shared';
import { ControlSchemeViewIoTreeNode } from '../../control-scheme-view.selectors';

@Component({
    standalone: true,
    selector: 'app-io-tree-node',
    templateUrl: './io-tree-node.component.html',
    styleUrls: [ './io-tree-node.component.scss' ],
    imports: [
        NgIf,
        IoInlineViewComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IoTreeNodeComponent {
    @Input() public node?: ControlSchemeViewIoTreeNode;
}
