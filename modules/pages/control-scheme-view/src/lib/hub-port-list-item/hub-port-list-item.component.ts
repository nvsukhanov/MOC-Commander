import { ChangeDetectionStrategy, Component, Input, Signal, WritableSignal, computed, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslocoPipe } from '@ngneat/transloco';
import { IOType } from 'rxpoweredup';
import { AsyncPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatError } from '@angular/material/form-field';
import { MatTooltip } from '@angular/material/tooltip';
import { EllipsisTitleDirective, IoTypeToL10nKeyPipe, PortIdToPortNamePipe } from '@app/shared-ui';
import { ControlSchemeBinding, PORT_TASKS_SELECTORS, PortCommandTask } from '@app/store';
import { RoutesBuilderService } from '@app/shared-misc';
import { BindingTypeToL10nKeyPipe } from '@app/shared-control-schemes';

import { HUB_PORT_LIST_ITEM_SELECTORS } from './hub-port-list-item.selectors';
import { HubPortBindingListItemComponent } from '../hub-port-binding-list-item';
import { PortCommandTaskSummaryPipe } from './port-command-task-summary.pipe';

@Component({
    standalone: true,
    selector: 'page-control-scheme-view-hub-port-list-item',
    templateUrl: './hub-port-list-item.component.html',
    styleUrls: [ './hub-port-list-item.component.scss' ],
    imports: [
        PortIdToPortNamePipe,
        EllipsisTitleDirective,
        TranslocoPipe,
        IoTypeToL10nKeyPipe,
        HubPortBindingListItemComponent,
        AsyncPipe,
        MatIcon,
        PortCommandTaskSummaryPipe,
        RouterLink,
        BindingTypeToL10nKeyPipe,
        MatError,
        MatTooltip
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubPortListItemComponent {
    public readonly isIoConnected: Signal<boolean> = computed(() => {
        const hubId = this._hubId();
        const portId = this._portId();
        if (hubId === null || portId === null) {
            return false;
        }
        return this.store.selectSignal(HUB_PORT_LIST_ITEM_SELECTORS.selectIsIoConnected({ hubId, portId }))();
    });

    public readonly ioType: Signal<IOType | null> = computed(() => {
        const hubId = this._hubId();
        const portId = this._portId();
        if (hubId === null || portId === null) {
            return null;
        }
        return this.store.selectSignal(HUB_PORT_LIST_ITEM_SELECTORS.selectIoType({ hubId, portId }))();
    });

    public readonly bindings: Signal<readonly ControlSchemeBinding[]> = computed(() => {
        const controlSchemeName = this._controlSchemeName();
        const hubId = this._hubId();
        const portId = this._portId();
        if (controlSchemeName === null || hubId === null || portId === null) {
            return [];
        }
        return this.store.selectSignal(HUB_PORT_LIST_ITEM_SELECTORS.selectIoBindings({ controlSchemeName, hubId, portId }))();
    });

    public readonly hasAccelerationProfileEnabled: Signal<boolean> = computed(() => {
        const controlSchemeName = this._controlSchemeName();
        const hubId = this._hubId();
        const portId = this._portId();
        if (controlSchemeName === null || hubId === null || portId === null) {
            return false;
        }
        return this.store.selectSignal(HUB_PORT_LIST_ITEM_SELECTORS.selectPortAccelerationProfileEnabled({ controlSchemeName, hubId, portId }))();
    });

    public readonly accelerationTimeMs: Signal<number> = computed(() => {
        const controlSchemeName = this._controlSchemeName();
        const hubId = this._hubId();
        const portId = this._portId();
        if (controlSchemeName === null || hubId === null || portId === null) {
            return 0;
        }
        return this.store.selectSignal(HUB_PORT_LIST_ITEM_SELECTORS.selectAccelerationTimeMs({ controlSchemeName, hubId, portId }))();
    });

    public readonly hasDecelerationProfileEnabled: Signal<boolean> = computed(() => {
        const controlSchemeName = this._controlSchemeName();
        const hubId = this._hubId();
        const portId = this._portId();
        if (controlSchemeName === null || hubId === null || portId === null) {
            return false;
        }
        return this.store.selectSignal(HUB_PORT_LIST_ITEM_SELECTORS.selectPortDecelerationProfileEnabled({ controlSchemeName, hubId, portId }))();
    });

    public readonly decelerationTimeMs: Signal<number | null> = computed(() => {
        const controlSchemeName = this._controlSchemeName();
        const hubId = this._hubId();
        const portId = this._portId();
        if (controlSchemeName === null || hubId === null || portId === null) {
            return null;
        }
        return this.store.selectSignal(HUB_PORT_LIST_ITEM_SELECTORS.selectDecelerationTimeMs({ controlSchemeName, hubId, portId }))();
    });

    public readonly runningTask: Signal<PortCommandTask | null> = computed(() => {
        const hubId = this._hubId();
        const portId = this._portId();
        if (hubId === null || portId === null) {
            return null;
        }
        return this.store.selectSignal(PORT_TASKS_SELECTORS.selectRunningTask({ hubId, portId }))();
    });

    public readonly lastExecutedTask: Signal<PortCommandTask | null> = computed(() => {
        const hubId = this._hubId();
        const portId = this._portId();
        if (hubId === null || portId === null) {
            return null;
        }
        return this.store.selectSignal(PORT_TASKS_SELECTORS.selectLastExecutedTask({ hubId, portId }))();
    });

    public readonly ioHasRequiredCapabilities: Signal<boolean> = computed(() => {
        const controlSchemeName = this._controlSchemeName();
        const hubId = this._hubId();
        const portId = this._portId();
        if (controlSchemeName === null || hubId === null || portId === null) {
            return false;
        }
        return this.store.selectSignal(HUB_PORT_LIST_ITEM_SELECTORS.selectIoHasRequiredCapabilities({ controlSchemeName, hubId, portId }))();
    });

    public readonly portConfigRoute: Signal<string[] | null> = computed(() => {
        const hasAccelerationProfileEnabled = this.hasAccelerationProfileEnabled();
        const hasDecelerationProfileEnabled = this.hasDecelerationProfileEnabled();
        const controlSchemeName = this._controlSchemeName();
        const hubId = this._hubId();
        const portId = this._portId();

        if (controlSchemeName !== null && hubId !== null && portId !== null && (hasAccelerationProfileEnabled || hasDecelerationProfileEnabled)) {
            return this.routeBuilderService.portConfigEdit(controlSchemeName, hubId, portId);
        }
        return null;
    });

    private _hubId: WritableSignal<string | null> = signal(null);

    private _portId: WritableSignal<number | null> = signal(null);

    private _controlSchemeName: WritableSignal<string | null> = signal(null);

    constructor(
        private readonly store: Store,
        private readonly routeBuilderService: RoutesBuilderService,
    ) {
    }

    @Input()
    public set hubId(
        value: string | null
    ) {
        this._hubId.set(value);
    }

    @Input()
    public set portId(
        value: number | null
    ) {
        this._portId.set(value);
    }

    @Input()
    public set controlSchemeName(
        value: string | null
    ) {
        this._controlSchemeName.set(value);
    }

    public get portId(): Signal<number | null> {
        return this._portId;
    }

    public get controlSchemeName(): Signal<string | null> {
        return this._controlSchemeName;
    }
}
