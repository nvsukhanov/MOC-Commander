import { ComponentRef, Directive, Input, OnDestroy, Type, ViewContainerRef } from '@angular/core';
import { Subscription, startWith } from 'rxjs';
import { HubIoOperationMode } from '@app/shared';

import { LinearOutputConfigurationEditComponent } from './binding-specifics';
import { IBindingsSpecificsComponent } from './i-bindings-specifics-component';
import { ControlSchemeBindingForm } from '../types';
import { ServoOutputConfigurationEditComponent } from './binding-specifics/servo';
import { SetAngleOutputConfigurationEditComponent } from './binding-specifics/set-angle';
import { StepperOutputConfigurationEditComponent } from './binding-specifics/stepper';

@Directive({
    standalone: true,
    selector: '[appRenderBindingSpecifics]',
    exportAs: 'appRenderBindingSpecifics'
})
export class RenderBindingSpecificsDirective implements OnDestroy {
    private readonly renderers: { [k in HubIoOperationMode]?: Type<IBindingsSpecificsComponent> } = {
        [HubIoOperationMode.Linear]: LinearOutputConfigurationEditComponent,
        [HubIoOperationMode.Servo]: ServoOutputConfigurationEditComponent,
        [HubIoOperationMode.SetAngle]: SetAngleOutputConfigurationEditComponent,
        [HubIoOperationMode.Stepper]: StepperOutputConfigurationEditComponent
    };

    private operationMode?: HubIoOperationMode;

    private renderer?: ComponentRef<IBindingsSpecificsComponent>;

    private _form?: ControlSchemeBindingForm;

    private sub?: Subscription;

    constructor(
        private readonly container: ViewContainerRef,
    ) {
    }

    @Input('appRenderBindingSpecifics')
    public set form(
        form: ControlSchemeBindingForm
    ) {
        this._form = form;
        this.sub?.unsubscribe();

        const opModeChanges = form.controls.bindingFormOperationMode.valueChanges;
        this.sub = opModeChanges.pipe(
            startWith(form.controls.bindingFormOperationMode.value)
        ).subscribe((operationMode: HubIoOperationMode) => {
            this.operationMode = operationMode;
            this.updateRenderer();
        });
    }

    public ngOnDestroy(): void {
        this.sub?.unsubscribe();
        this.renderer?.destroy();
    }

    private updateRenderer(): void {
        if (this.operationMode === undefined || this._form == undefined) {
            return;
        }
        const renderer = this.renderers[this.operationMode];
        if (!renderer) {
            this.renderer?.destroy();
            this.renderer = undefined;
            return;
        }

        if (!(this.renderer?.instance instanceof renderer)) {
            this.renderer?.destroy();
            this.renderer = undefined;

            this.renderer = this.container.createComponent(renderer);
        }

        this.renderer.instance.setForm(this._form.controls[this.operationMode]);
    }
}
