import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LetDirective } from '@ngrx/component';
import { TranslocoModule } from '@ngneat/transloco';
import { RouterLink } from '@angular/router';

import { IoTreeNodeComponent } from './io-tree-node';
import { HubTreeNodeComponent } from './hub-tree-node';
import { BindingTreeNodeComponent } from './binding-tree-node';
import { ControlSchemeNodeTypes, ControlSchemeViewTreeNode } from '../types';

@Component({
    standalone: true,
    selector: 'app-control-scheme-view-io-list',
    templateUrl: './control-scheme-view-io-list.component.html',
    styleUrls: [ './control-scheme-view-io-list.component.scss' ],
    imports: [
        NgForOf,
        NgIf,
        MatCardModule,
        MatTreeModule,
        MatButtonModule,
        MatIconModule,
        LetDirective,
        BindingTreeNodeComponent,
        IoTreeNodeComponent,
        HubTreeNodeComponent,
        TranslocoModule,
        RouterLink,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeViewIoListComponent {
    public treeControl = new NestedTreeControl<ControlSchemeViewTreeNode, string>(
        (node) => node.children,
        {
            trackBy: this.trackByNodeTypeFn
        }
    );

    public dataSource = new MatTreeNestedDataSource<ControlSchemeViewTreeNode>();

    private initialExpansionDone = false;

    @Input()
    public set tree(
        v: ControlSchemeViewTreeNode[] | undefined
    ) {
        this.dataSource.data = v ?? [];
        this.treeControl.dataNodes = this.dataSource.data;
        if (!this.initialExpansionDone) {
            this.initialExpansionDone = true;
            this.treeControl.dataNodes
                .filter((node) => node.initiallyExpanded)
                .forEach((node) => {
                    this.treeControl.expand(node);
                });
        }
    }

    public get isEmpty(): boolean {
        return this.dataSource.data.length === 0;
    }

    public trackByNodeTypeFn(item: ControlSchemeViewTreeNode): string {
        return item.path;
    }

    public isHub(_: number, node: ControlSchemeViewTreeNode): boolean {
        return node.nodeType === ControlSchemeNodeTypes.Hub;
    }

    public isPort(_: number, node: ControlSchemeViewTreeNode): boolean {
        return node.nodeType === ControlSchemeNodeTypes.Io;
    }
}