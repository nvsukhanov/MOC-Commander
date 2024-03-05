import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslocoPipe } from '@ngneat/transloco';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NEVER, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { ScreenSizeObserverService } from '@app/shared-misc';
import { BindingControllerInputNamePipe, BindingTypeToL10nKeyPipe } from '@app/shared-control-schemes';

import { BindingTreeNodeViewModel } from './binding-tree-node-view-model';
import { INPUT_TREE_NODE_VIEW_MODEL_SELECTOR } from './input-tree-node-view-model.selector';
import { BindingViewUrlPipe } from './binding-view-url.pipe';
import { ControlSchemeViewBindingTreeNodeData } from '../types';
import { BindingInputSummaryPipe } from './binding-input-summary.pipe';

@Component({
    standalone: true,
    selector: 'page-control-scheme-view-binding-tree-node',
    templateUrl: './binding-tree-node.component.html',
    styleUrls: [ './binding-tree-node.component.scss' ],
    imports: [
        BindingTypeToL10nKeyPipe,
        TranslocoPipe,
        MatFormFieldModule,
        RouterLink,
        BindingViewUrlPipe,
        BindingControllerInputNamePipe,
        BindingInputSummaryPipe,
        AsyncPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingTreeNodeComponent {
    public readonly isSmallScreen$ = this.screenSizeObserverService.isSmallScreen$;

    private _treeNodeData?: ControlSchemeViewBindingTreeNodeData;

    private _viewModel$: Observable<BindingTreeNodeViewModel> = NEVER;

    constructor(
        private readonly store: Store,
        private readonly screenSizeObserverService: ScreenSizeObserverService
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
                this._viewModel$ = this.store.select(INPUT_TREE_NODE_VIEW_MODEL_SELECTOR(
                    treeNodeData.schemeName,
                    treeNodeData.binding,
                    treeNodeData.ioHasNoRequiredCapabilities
                ));
            }
        }
    }
}
