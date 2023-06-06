import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {
    ControllerL10nInputNamePipe,
    ControllerL10nTypePipe,
    ControllerTypeIconPipe,
    EllipsisTitleDirective,
    IoOperationTypeToL10nKeyPipe
} from '../../../../common';
import { TranslocoModule } from '@ngneat/transloco';
import { ControlSchemeViewBindingTreeNode } from '../../../../store';
import { PushPipe } from '@ngrx/component';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    standalone: true,
    selector: 'app-binding-tree-node',
    templateUrl: './binding-tree-node.component.html',
    styleUrls: [ './binding-tree-node.component.scss' ],
    imports: [
        NgIf,
        MatIconModule,
        ControllerTypeIconPipe,
        IoOperationTypeToL10nKeyPipe,
        TranslocoModule,
        EllipsisTitleDirective,
        ControllerL10nInputNamePipe,
        PushPipe,
        ControllerL10nTypePipe,
        MatFormFieldModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingTreeNodeComponent {
    @Input() public binding?: ControlSchemeViewBindingTreeNode;
}
