import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { TranslocoPipe } from '@ngneat/transloco';
import { AsyncPipe } from '@angular/common';
import { HubInlineViewComponent } from '@app/shared-ui';

import { ControlSchemeViewHubTreeNode } from '../types';
import { HUB_TREE_NODE_SELECTORS, IHubTreeNodeViewModel } from './hub-tree-node.selectors';

@Component({
    standalone: true,
    selector: 'page-control-scheme-view-hub-tree-node',
    templateUrl: './hub-tree-node.component.html',
    styleUrls: [ './hub-tree-node.component.scss' ],
    imports: [
        HubInlineViewComponent,
        TranslocoPipe,
        AsyncPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubTreeNodeComponent {
    private _viewModel$: Observable<IHubTreeNodeViewModel | null> = of(null);

    constructor(
        private readonly store: Store
    ) {
    }

    @Input()
    public set hubTreeNode(
        node: ControlSchemeViewHubTreeNode
    ) {
        this._viewModel$ = this.store.select(HUB_TREE_NODE_SELECTORS.selectViewModel(node.hubId));
    }

    public get viewModel$(): Observable<IHubTreeNodeViewModel | null> {
        return this._viewModel$;
    }
}
