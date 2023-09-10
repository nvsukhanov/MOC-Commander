import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { LetDirective, PushPipe } from '@ngrx/component';
import { HubInlineViewComponent } from '@app/shared';

import { ControlSchemeViewHubTreeNode } from '../../types';
import { HUB_TREE_NODE_SELECTORS, IHubTreeNodeViewModel } from './hub-tree-node.selectors';

@Component({
    standalone: true,
    selector: 'app-hub-tree-node',
    templateUrl: './hub-tree-node.component.html',
    styleUrls: [ './hub-tree-node.component.scss' ],
    imports: [
        NgIf,
        HubInlineViewComponent,
        LetDirective,
        PushPipe
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
