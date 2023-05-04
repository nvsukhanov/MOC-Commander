import { ComponentRef, Directive, Input, OnDestroy, Type, ViewContainerRef } from '@angular/core';
import { ControlSchemeBindingOutputForm } from '../binding-output';
import { HubIoOperationMode } from '../../../store';
import { IOutputConfigurationRenderer } from './i-output-configuration-renderer';
import { OutputNoConfigurationComponent } from './no-configuration';
import { Observable, startWith, Subscription } from 'rxjs';
import { ControlSchemeBindingInputForm } from '../binding-input';
import { LinearOutputConfigurationEditComponent } from './linear';
import { ServoOutputConfigurationEditComponent } from './servo';

@Directive({
    standalone: true,
    selector: '[appRenderEditOutputConfiguration]',
    exportAs: 'appRenderEditOutputConfiguration'
})
export class RenderEditOutputConfigurationDirective implements OnDestroy {
    private readonly renderers: { [k in HubIoOperationMode]?: Type<IOutputConfigurationRenderer> } = {
        [HubIoOperationMode.Linear]: LinearOutputConfigurationEditComponent,
        [HubIoOperationMode.Servo]: ServoOutputConfigurationEditComponent
    };

    private _inputFormControl?: ControlSchemeBindingInputForm;

    private readonly noConfigurationRenderer = OutputNoConfigurationComponent;

    private operationMode?: HubIoOperationMode;

    private _outputFormControl?: ControlSchemeBindingOutputForm;

    private renderer?: ComponentRef<IOutputConfigurationRenderer>;

    private sub?: Subscription;

    constructor(
        private readonly container: ViewContainerRef
    ) {
    }

    @Input()
    public set inputFormControl(
        v: ControlSchemeBindingInputForm
    ) {
        this._inputFormControl = v;
        this.updateRenderer();
    }

    @Input()
    public set outputFormControl(
        v: ControlSchemeBindingOutputForm
    ) {
        this._outputFormControl = v;
        this.sub?.unsubscribe();

        const opModeChanges = v.controls.operationMode.valueChanges as Observable<HubIoOperationMode>;
        this.sub = opModeChanges.pipe(
            startWith(v.controls.operationMode.value)
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
        if (this.operationMode === undefined || this._outputFormControl == undefined) {
            return;
        }
        const renderer = this.resolveRenderer(this.operationMode);

        if (!(this.renderer?.instance instanceof renderer)) {
            this.renderer?.destroy();
            this.renderer = undefined;

            this.renderer = this.container.createComponent(renderer);
        }

        if (this.renderer.instance.setOutputFormControl) {
            this.renderer.instance.setOutputFormControl(this._outputFormControl);
        }

        if (this.renderer.instance.setInputFormControl && this._inputFormControl) {
            this.renderer.instance.setInputFormControl(this._inputFormControl);
        }
    }

    private resolveRenderer(
        operationMode: HubIoOperationMode
    ): Type<IOutputConfigurationRenderer> {
        const renderer = this.renderers[operationMode];

        if (!renderer) {
            return this.noConfigurationRenderer;
        }

        return renderer;
    }
}
