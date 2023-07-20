import { ControlSchemeV2Binding, ControlSchemeV2Model } from '@app/store';

import { ControlSchemeEditForm } from './edit';

export function mapFormToModel(
    form: ControlSchemeEditForm
): ControlSchemeV2Model {
    const rawData = form.getRawValue();
    return {
        id: rawData.id,
        name: rawData.name,
        bindings: rawData.bindings.map((data) => ({
            operationMode: data.bindingFormOperationMode,
            ...data[data.bindingFormOperationMode]
        }) as ControlSchemeV2Binding)
    };
}
