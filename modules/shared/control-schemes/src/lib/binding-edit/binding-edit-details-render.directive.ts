import { Directive, Inject, Input, OnDestroy, Output, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';
import { ControlSchemeBinding } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { IBindingDetailsEditFormRenderer } from './i-binding-details-edit-form-renderer';
import { BINDING_DETAILS_EDIT_FORM_RENDERER_FACTORY, IBindingDetailsEditFormRendererFactory } from './i-binding-details-edit-form-renderer-factory';

@Directive({
    standalone: true,
    selector: '[libCsBindingEditDetailsRender]'
})
export class BindingEditDetailsRenderDirective implements OnDestroy {
    @Output('libCsBindingEditDetailsRenderBindingChange') public readonly bindingChange: Observable<ControlSchemeBinding | null>;

    // eslint-disable-next-line @angular-eslint/no-output-rename
    @Output('libCsBindingEditDetailsRenderBindingFormDirtyChange') public readonly dirtyChange: Observable<boolean>;

    private rendererInstance: IBindingDetailsEditFormRenderer;

    constructor(
        private readonly viewContainer: ViewContainerRef,
        @Inject(BINDING_DETAILS_EDIT_FORM_RENDERER_FACTORY) private readonly factory: IBindingDetailsEditFormRendererFactory
    ) {
        this.rendererInstance = this.factory.create(this.viewContainer);
        this.bindingChange = this.rendererInstance.bindingChange;
        this.dirtyChange = this.rendererInstance.bindingFormDirtyChange;
    }

    @Input('libCsBindingEditDetailsRender')
    public set binding(
        b: Partial<ControlSchemeBinding> | null
    ) {
        this.rendererInstance.setBinding(b);
    }

    @Input('libCsBindingEditDetailsRenderBindingType')
    public set bindingType(
        b: ControlSchemeBindingType
    ) {
        this.rendererInstance.setBindingType(b);
    }

    public ngOnDestroy(): void {
        this.rendererInstance.dispose();
    }
}
