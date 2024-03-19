import { InjectionToken, ViewContainerRef } from '@angular/core';

import { IBindingDetailsEditFormRenderer } from './i-binding-details-edit-form-renderer';

export interface IBindingDetailsEditFormRendererFactory {
    create(
        container: ViewContainerRef,
    ): IBindingDetailsEditFormRenderer;
}

export const BINDING_DETAILS_EDIT_FORM_RENDERER_FACTORY
    = new InjectionToken<IBindingDetailsEditFormRendererFactory>('BINDING_DETAILS_EDIT_FORM_RENDERER_FACTORY');
