import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';
import { RouterLink } from '@angular/router';
import { PushPipe } from '@ngrx/component';
import { IoInlineViewComponent } from '@app/shared';

import { ControlSchemeViewIoTreeNode } from '../../types';
import { RoutesBuilderService } from '../../../../routing';
import { PortCommandTaskSummaryPipe } from '../../../port-command-task-summary';

@Component({
    standalone: true,
    selector: 'app-io-tree-node',
    templateUrl: './io-tree-node.component.html',
    styleUrls: [ './io-tree-node.component.scss' ],
    imports: [
        NgIf,
        IoInlineViewComponent,
        MatIconModule,
        TranslocoModule,
        RouterLink,
        PortCommandTaskSummaryPipe,
        PushPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IoTreeNodeComponent {
    private _node?: ControlSchemeViewIoTreeNode;

    private _portConfigRoute: string[] = [];

    constructor(
        private readonly routeBuilderService: RoutesBuilderService
    ) {
    }

    @Input()
    public set node(v: ControlSchemeViewIoTreeNode | undefined) {
        this._node = v;
        if (v) {
            this._portConfigRoute = this.routeBuilderService.portConfigEdit(
                v.schemeName,
                v.hubId,
                v.portId
            );
        } else {
            this._portConfigRoute = [];
        }

    }

    public get node(): ControlSchemeViewIoTreeNode | undefined {
        return this._node;
    }

    public get portConfigRoute(): string[] {
        return this._portConfigRoute;
    }
}
