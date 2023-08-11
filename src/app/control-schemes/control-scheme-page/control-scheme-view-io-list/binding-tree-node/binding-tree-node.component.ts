import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';
import { PushPipe } from '@ngrx/component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NEVER, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { EllipsisTitleDirective, HubIoOperationMode, IoOperationTypeToL10nKeyPipe, NotConnectedInlineIconComponent } from '@app/shared';

import { BindingTreeNodeViewModel } from './binding-tree-node-view-model';
import { SINGLE_INPUT_TREE_NODE_VIEW_MODEL_SELECTOR } from './single-input-tree-node-view-model.selector';
import { FullControllerInputNameComponent } from '../../../full-controller-input-name';
import { BindingViewUrlPipe } from './binding-view-url.pipe';
import { ControlSchemeViewBindingTreeNodeData } from '../../types';

@Component({
    standalone: true,
    selector: 'app-binding-tree-node',
    templateUrl: './binding-tree-node.component.html',
    styleUrls: [ './binding-tree-node.component.scss' ],
    imports: [
        NgIf,
        MatIconModule,
        IoOperationTypeToL10nKeyPipe,
        TranslocoModule,
        EllipsisTitleDirective,
        PushPipe,
        MatFormFieldModule,
        NotConnectedInlineIconComponent,
        JsonPipe,
        NgForOf,
        FullControllerInputNameComponent,
        MatButtonModule,
        RouterLink,
        BindingViewUrlPipe,
        MatListModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingTreeNodeComponent {
    private _treeNodeData?: ControlSchemeViewBindingTreeNodeData;

    private _viewModel$: Observable<BindingTreeNodeViewModel> = NEVER;

    constructor(
        private readonly store: Store,
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
                    treeNodeData.controlSchemeId,
                    treeNodeData.binding,
                    treeNodeData.isActive,
                    treeNodeData.ioHasNoRequiredCapabilities
                ));
        }
    }
}
