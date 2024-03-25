import { ChangeDetectionStrategy, Component, Inject, Input, WritableSignal, computed, signal } from '@angular/core';
import { of } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { TranslocoPipe } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { CONTROLLER_CONNECTION_SELECTORS, ControlSchemeBinding, ControlSchemeBindingInputs, ControlSchemeInputConfig } from '@app/store';
import { BINDING_CONTROLLER_INPUT_NAME_RESOLVER, IBindingControllerInputNameResolver } from '@app/shared-control-schemes';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { EllipsisTitleDirective } from '@app/shared-components';

import { BINDING_INPUT_NAME_RESOLVER, IBindingInputNameResolver } from './i-binding-input-name-resolver';

@Component({
    standalone: true,
    selector: 'page-control-scheme-view-binding-action-list-item',
    templateUrl: './binding-action-list-item.component.html',
    styleUrls: [ './binding-action-list-item.component.scss' ],
    imports: [
        AsyncPipe,
        TranslocoPipe,
        EllipsisTitleDirective
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingActionListItemComponent<
    TBindingType extends ControlSchemeBindingType,
    TBinding extends ControlSchemeBinding & { bindingType: TBindingType },
    TAction extends keyof ControlSchemeBindingInputs<TBindingType>
> {
    public readonly actionName = computed(() => {
        const binding = this._binding();
        const action = this._action();
        if (!binding || !action) {
            return of('');
        }
        return this.inputNameResolver.getBindingActionName(binding, action as keyof typeof binding.inputs);
    });

    public readonly controllerInputName = computed(() => {
        const binding = this._binding();
        const action = this._action();
        if (!binding || !action) {
            return of('');
        }
        const inputConfig = binding.inputs[action as keyof typeof binding.inputs];
        return this.bindingControllerInputNameProvider.getControllerInputName(
            binding.bindingType,
            action as keyof typeof binding.inputs,
            inputConfig
        );
    });

    public readonly isControllerConnected = computed(() => {
        const binding = this._binding();
        const action = this._action();
        if (!binding || !action) {
            return false;
        }
        const inputConfig = binding.inputs[action as keyof typeof binding.inputs] as ControlSchemeInputConfig;
        return this.store.selectSignal(CONTROLLER_CONNECTION_SELECTORS.isConnected(inputConfig.controllerId))();
    });

    private _binding: WritableSignal<TBinding | null> = signal(null);

    private _action: WritableSignal<TAction | null> = signal(null);

    constructor(
        @Inject(BINDING_CONTROLLER_INPUT_NAME_RESOLVER) private readonly bindingControllerInputNameProvider: IBindingControllerInputNameResolver,
        @Inject(BINDING_INPUT_NAME_RESOLVER) private readonly inputNameResolver: IBindingInputNameResolver,
        private readonly store: Store
    ) {
    }

    @Input()
    public set binding(
        value: TBinding | null
    ) {
        this._binding.set(value);
    }

    @Input()
    public set action(
        value: TAction | null
    ) {
        this._action.set(value);
    }
}
