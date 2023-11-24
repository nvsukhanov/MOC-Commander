import { ComponentRef, Directive, Input, OnDestroy, Type, ViewContainerRef } from '@angular/core';
import { Subscription, startWith } from 'rxjs';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { IBindingsDetailsEditComponent } from './i-bindings-details-edit-component';
import { BindingSetSpeedEditComponent } from './binding-set-speed';
import { BindingServoEditComponent } from './binding-servo';
import { BindingSetAngleEditComponent } from './binding-set-angle';
import { BindingStepperEditComponent } from './binding-stepper';
import { ControlSchemeBindingForm } from '../forms';
import { BindingTrainControlEditComponent } from './binding-train-control';
import { BindingGearboxControlEditComponent } from './binding-gearbox-control';

@Directive({
    standalone: true,
    selector: '[libCsRenderBindingDetailsEdit]',
    exportAs: 'libCsRenderBindingDetailsEdit'
})
export class RenderBindingDetailsEditDirective implements OnDestroy {
    private readonly renderers: { [k in ControlSchemeBindingType]: Type<IBindingsDetailsEditComponent> | null } = {
        [ControlSchemeBindingType.SetSpeed]: BindingSetSpeedEditComponent,
        [ControlSchemeBindingType.Servo]: BindingServoEditComponent,
        [ControlSchemeBindingType.SetAngle]: BindingSetAngleEditComponent,
        [ControlSchemeBindingType.Stepper]: BindingStepperEditComponent,
        [ControlSchemeBindingType.TrainControl]: BindingTrainControlEditComponent,
        [ControlSchemeBindingType.GearboxControl]: BindingGearboxControlEditComponent
    };

    private operationMode?: ControlSchemeBindingType;

    private renderer?: ComponentRef<IBindingsDetailsEditComponent>;

    private _form?: ControlSchemeBindingForm;

    private sub?: Subscription;

    constructor(
        private readonly container: ViewContainerRef,
    ) {
    }

    @Input('libCsRenderBindingDetailsEdit')
    public set form(
        form: ControlSchemeBindingForm
    ) {
        this._form = form;
        this.sub?.unsubscribe();

        const opModeChanges = form.controls.bindingType.valueChanges;
        this.sub = opModeChanges.pipe(
            startWith(form.controls.bindingType.value)
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