import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { MatFabAnchor } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { RoutesBuilderService } from '@app/shared-misc';

import { HubListItemComponent } from './hub-list-item';
import { BINDING_LIST_SELECTORS } from './bindings-list.selectors';
import { CONTROL_SCHEME_PAGE_SELECTORS } from '../control-scheme-page.selectors';

@Component({
    standalone: true,
    selector: 'page-control-scheme-view-bindings-section',
    templateUrl: './bindings-section.component.html',
    styleUrl: './bindings-section.component.scss',
    imports: [
        HubListItemComponent,
        MatIcon,
        TranslocoPipe,
        MatFabAnchor,
        RouterLink,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingsSectionComponent {
    public readonly hubIds = this.store.selectSignal(BINDING_LIST_SELECTORS.selectSchemeHubsIds);

    public readonly canAddBinding = this.store.selectSignal(BINDING_LIST_SELECTORS.canAddBinding);

    public readonly controlSchemeName = computed(() => {
        const controlScheme = this.store.selectSignal(CONTROL_SCHEME_PAGE_SELECTORS.selectCurrentlyViewedScheme)();
        return controlScheme ? controlScheme.name : '';
    });

    public readonly addBindingPath = computed(() => {
        const controlScheme = this.store.selectSignal(CONTROL_SCHEME_PAGE_SELECTORS.selectCurrentlyViewedScheme)();
        return controlScheme ? this.routeBuilderService.bindingCreate(controlScheme.name) : [];
    });

    public readonly isSchemeRunning = this.store.selectSignal(CONTROL_SCHEME_PAGE_SELECTORS.isCurrentControlSchemeRunning);

    constructor(
        private readonly store: Store,
        private readonly routeBuilderService: RoutesBuilderService
    ) {
    }
}
