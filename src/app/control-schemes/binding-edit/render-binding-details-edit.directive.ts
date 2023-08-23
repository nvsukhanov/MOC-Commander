import { ComponentRef, Directive, Input, OnDestroy, Type, ViewContainerRef } from '@angular/core';
import { Subscription, startWith } from 'rxjs';
import { ControlSchemeBindingType } from '@app/shared';

import { IBindingsDetailsEditComponent } from './i-bindings-details-edit-component';
import { BindingLinearEditComponent } from './binding-linear';
import { BindingServoEditComponent } from './binding-servo';
import { BindingSetAngleEditComponent } from './binding-set-angle';
import { BindingStepperEditComponent } from './binding-stepper';
import { ControlSchemeBindingForm } from './types';
import { BindingSpeedShiftComponent } from './binding-speed-selector';

@Directive({
    standalone: true,
    selector: '[appRenderBindingDetailsEdit]',
    exportAs: 'appRenderBindingDetailsEdit'
})
export class RenderBindingDetailsEditDirective implements OnDestroy {
    private readonly renderers: { [k in ControlSchemeBindingType]: Type<IBindingsDetailsEditComponent> | null } = {
        [ControlSchemeBindingType.Linear]: BindingLinearEditComponent,
        [ControlSchemeBindingType.Servo]: BindingServoEditComponent,
        [ControlSchemeBindingType.SetAngle]: BindingSetAngleEditComponent,
        [ControlSchemeBindingType.Stepper]: BindingStepperEditComponent,
        [ControlSchemeBindingType.SpeedShift]: BindingSpeedShiftComponent
    };

    private operationMode?: ControlSchemeBindingType;

    private renderer?: ComponentRef<IBindingsDetailsEditComponent>;

    private _form?: ControlSchemeBindingForm;

    private sub?: Subscription;

    constructor(
        private readonly container: ViewContainerRef,
    ) {
    }

    @Input('appRenderBindingDetailsEdit')
    public set form(
        form: ControlSchemeBindingForm
    ) {
        this._form = form;
        this.sub?.unsubscribe();

        const opModeChanges = form.controls.bindingFormOperationMode.valueChanges;
        this.sub = opModeChanges.pipe(
            startWith(form.controls.bindingFormOperationMode.value)
        ).subscribe((operationMode: ControlSchemeBindingType) => {
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
