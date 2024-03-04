import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';

import { EllipsisTitleDirective } from '../ellipsis-title.directive';
import { IBreadcrumbDefinition } from './i-breadcrumb-definition';

@Component({
    standalone: true,
    selector: 'lib-breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
    styleUrls: [ './breadcrumbs.component.scss' ],
    imports: [
        RouterLink,
        EllipsisTitleDirective,
        MatIcon,
        AsyncPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbsComponent {
    private _breadcrumbsDef: ReadonlyArray<IBreadcrumbDefinition> = [];

    @Input() public set breadcrumbsDef(
        v: ReadonlyArray<IBreadcrumbDefinition> | null
    ) {
        this._breadcrumbsDef = v ?? [];
    }

    public get breadcrumbsDef(): ReadonlyArray<IBreadcrumbDefinition> {
        return this._breadcrumbsDef;
    }
}

