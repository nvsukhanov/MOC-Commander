import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { BreadcrumbsStateService } from './breadcrumbs-state.service';
import { IBreadcrumbDefinition } from './i-breadcrumb-definition';

@Injectable()
export class BreadcrumbsService implements OnDestroy {
    private sub?: Subscription;

    constructor(
        private readonly breadcrumbsService: BreadcrumbsStateService,
    ) {
    }

    public setBreadcrumbsDef(
        def$: Observable<ReadonlyArray<IBreadcrumbDefinition>>
    ): void {
        this.sub = def$.subscribe((def) => this.breadcrumbsService.setBreadcrumbsDef(def));
    }

    public ngOnDestroy(): void {
        this.sub?.unsubscribe();
        this.breadcrumbsService.clearBreadcrumbs();
    }
}
