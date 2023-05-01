import { ComponentRef, Directive, Input, OnDestroy, Type, ViewContainerRef } from '@angular/core';
import { ControlSchemeBindingOutputControl } from '../binding-output';
import { HubIoOperationMode } from '../../../store';
import { IOutputConfigurationRenderer } from './i-output-configuration-renderer';
import { OutputNoConfigurationComponent } from './no-configuration';
import { startWith, Subscription } from 'rxjs';
import { ControlSchemeBindingInputControl } from '../binding-input';
import { LinearOutputConfigurationEditComponent } from './linear';

@Directive({
    standalone: true,
    selector: '[appRenderEditOutputConfiguration]',
    exportAs: 'appRenderEditOutputConfiguration'
})
export class RenderEditOutputConfigurationDirective implements OnDestroy {
    private readonly renderers: { [k in HubIoOperationMode]?: Type<IOutputConfigurationRenderer<k>> } = {
        [HubIoOperationMode.Linear]: LinearOutputConfigurationEditComponent
    };

    private _inputFormControl?: ControlSchemeBindingInputControl;

    private readonly noConfigurationRenderer = OutputNoConfigurationComponent;

    private operationMode?: HubIoOperationMode;

    private _outputFormControl?: ControlSchemeBindingOutputControl;

    private renderer?: ComponentRef<IOutputConfigurationRenderer<HubIoOperationMode>>;

    private sub?: Subscription;

    constructor(
        private readonly container: ViewContainerRef
    ) {
    }

    @Input()
    public set inputFormControl(
        v: ControlSchemeBindingInputControl
    ) {
        this._inputFormControl = v;
        this.updateRenderer();
    }

    @Input()
    public set outputFormControl(
        v: ControlSchemeBindingOutputControl
    ) {
        this._outputFormControl = v;
        this.sub?.unsubscribe();
        this.sub = v.controls.operationMode.valueChanges.pipe(
            startWith(v.controls.operationMode.value)
        ).subscribe((operationMode) => {
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
    ): Type<IOutputConfigurationRenderer<HubIoOperationMode>> {
        const renderer = this.renderers[operationMode];

        if (!renderer) {
            return this.noConfigurationRenderer;
        }

        return renderer;
    }
}
