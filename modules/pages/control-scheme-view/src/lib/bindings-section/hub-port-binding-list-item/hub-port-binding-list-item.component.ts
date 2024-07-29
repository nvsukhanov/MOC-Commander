import { ChangeDetectionStrategy, Component, Input, Signal, WritableSignal, computed, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatError } from '@angular/material/form-field';
import { TranslocoPipe } from '@jsverse/transloco';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ControlSchemeBinding, HUBS_SELECTORS } from '@app/store';
import { BindingControllerInputNamePipe, BindingTypeToL10nKeyPipe } from '@app/shared-control-schemes';
import { RoutesBuilderService, ScreenSizeObserverService } from '@app/shared-misc';
import { PortIdToPortNamePipe } from '@app/shared-components';

import { BindingActionListItemComponent } from '../binding-action-list-item';

@Component({
    standalone: true,
    selector: 'page-control-scheme-view-hub-port-binding-list-item',
    templateUrl: './hub-port-binding-list-item.component.html',
    styleUrls: [ './hub-port-binding-list-item.component.scss' ],
    imports: [
        AsyncPipe,
        BindingControllerInputNamePipe,
        BindingTypeToL10nKeyPipe,
        MatError,
        TranslocoPipe,
        RouterLink,
        BindingActionListItemComponent,
        PortIdToPortNamePipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubPortBindingListItemComponent {
    public readonly bindingEditPath = computed(() => {
        const controlSchemeName = this._controlSchemeName();
        const binding = this._binding();
        if (controlSchemeName === null || binding === null) {
            return [];
        }
        return this.routesBuilderService.bindingView(controlSchemeName, binding.id);
    });

    public readonly bindingActions = computed(() => {
        const binding = this._binding();
        if (binding === null) {
            return [];
        }
        return Object.keys(binding.inputs) as (keyof ControlSchemeBinding['inputs'])[];
    });

    public readonly hubName = computed(() => {
        const binding = this._binding();
        if (binding === null) {
            return '';
        }
        return this.store.selectSignal(HUBS_SELECTORS.selectHubName(binding.hubId))();
    });

    private _binding: WritableSignal<ControlSchemeBinding | null> = signal(null);

    private _controlSchemeName: WritableSignal<string | null> = signal(null);

    constructor(
        private readonly screenSizeObserverService: ScreenSizeObserverService,
        private readonly routesBuilderService: RoutesBuilderService,
        private readonly store: Store
    ) {
    }

    @Input()
    public set binding(
        value: ControlSchemeBinding | null
    ) {
        this._binding.set(value);
    }

    @Input()
    public set controlSchemeName(
        value: string | null
    ) {
        this._controlSchemeName.set(value);
    }

    public get binding(): Signal<ControlSchemeBinding | null> {
        return this._binding;
    }

    public get isSmallScreen$(): Observable<boolean> {
        return this.screenSizeObserverService.isSmallScreen$;
    }
}
