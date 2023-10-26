import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoPipe } from '@ngneat/transloco';
import { RouterLink } from '@angular/router';
import { PushPipe } from '@ngrx/component';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { RoutesBuilderService } from '@app/routing';
import { ScreenSizeObserverService } from '@app/shared';

import { IoInlineViewComponent } from '../io-inline-view';
import { ControlSchemeViewIoTreeNode } from '../../types';
import { PortCommandTaskSummaryPipe } from './port-command-task-summary';
import { IHubTreeNodeViewModel, IO_TREE_NODE_SELECTORS } from './io-tree-node.selectors';

@Component({
    standalone: true,
    selector: 'app-io-tree-node',
    templateUrl: './io-tree-node.component.html',
    styleUrls: [ './io-tree-node.component.scss' ],
    imports: [
        NgIf,
        IoInlineViewComponent,
        MatIconModule,
        TranslocoPipe,
        RouterLink,
        PortCommandTaskSummaryPipe,
        PushPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IoTreeNodeComponent {
    public readonly isSmallScreen$ = this.screenSizeObserverService.isSmallScreen$;

    private _viewModel$: Observable<IHubTreeNodeViewModel | null> = of(null);

    private _portConfigRoute: string[] = [];

    constructor(
        private readonly routeBuilderService: RoutesBuilderService,
        private readonly store: Store,
        private readonly screenSizeObserverService: ScreenSizeObserverService
    ) {
    }

    @Input()
    public set node(v: ControlSchemeViewIoTreeNode | undefined) {
        if (v) {
            this._portConfigRoute = this.routeBuilderService.portConfigEdit(
                v.schemeName,
                v.hubId,
                v.portId
            );
            this._viewModel$ = this.store.select(IO_TREE_NODE_SELECTORS.selectViewModel(v));
        } else {
            this._portConfigRoute = [];
            this._viewModel$ = of(null);
        }
    }

    public get viewModel$(): Observable<IHubTreeNodeViewModel | null> {
        return this._viewModel$;
    }

    public get portConfigRoute(): string[] {
        return this._portConfigRoute;
    }
}
