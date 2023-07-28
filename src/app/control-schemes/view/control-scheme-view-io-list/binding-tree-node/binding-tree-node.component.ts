import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';
import { PushPipe } from '@ngrx/component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NEVER, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import {
    ControllerL10nTypePipe,
    ControllerTypeIconPipe,
    EllipsisTitleDirective,
    HubIoOperationMode,
    IoOperationTypeToL10nKeyPipe,
    NotConnectedInlineIconComponent
} from '@app/shared';

import { ControlSchemeViewBindingTreeNodeData } from '../../control-scheme-view.selectors';
import { ControllerL10nInputNamePipe } from '../../../controller-l10n-input-name.pipe';
import { ControllerL10nNamePipe } from '../../../controller-l10n-name.pipe';
import { BindingTreeNodeViewModel } from './binding-tree-nove-view-model';
import { SINGLE_INPUT_TREE_NODE_VIEW_MODEL_SELECTOR } from './single-input-tree-node-view-model.selector';
import { FullControllerInputNameComponent } from '../../../full-controller-input-name';

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
        MatFormFieldModule,
        NotConnectedInlineIconComponent,
        ControllerL10nNamePipe,
        JsonPipe,
        NgForOf,
        FullControllerInputNameComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingTreeNodeComponent {
    private _treeNodeData?: ControlSchemeViewBindingTreeNodeData;

    private _viewModel$: Observable<BindingTreeNodeViewModel> = NEVER;

    constructor(
        private store: Store
    ) {
    }

    public get viewModel$(): Observable<BindingTreeNodeViewModel> {
        return this._viewModel$;
    }

    @Input()
    public set treeNodeData(
        treeNodeData: ControlSchemeViewBindingTreeNodeData | undefined
    ) {
        if (this._treeNodeData !== treeNodeData) {
            this._treeNodeData = treeNodeData;
            if (!treeNodeData) {
                this._viewModel$ = NEVER;
            } else {
                this._viewModel$ = this.recalculateTreeNodeViewSelector(treeNodeData);
            }
        }
    }

    private recalculateTreeNodeViewSelector(
        treeNodeData: ControlSchemeViewBindingTreeNodeData
    ): Observable<BindingTreeNodeViewModel> {
        switch (treeNodeData.binding.operationMode) {
            case HubIoOperationMode.Stepper:
            case HubIoOperationMode.SetAngle:
            case HubIoOperationMode.Servo:
            case HubIoOperationMode.Linear:
                return this.store.select(SINGLE_INPUT_TREE_NODE_VIEW_MODEL_SELECTOR(
                    treeNodeData.binding,
                    treeNodeData.isActive,
                    treeNodeData.ioHasNoRequiredCapabilities
                ));
        }
    }
}
