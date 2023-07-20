import { ControlSchemeBinding, ControlSchemeModel } from '@app/store';

import { ControlSchemeEditForm } from './edit';

export function mapFormToModel(
    form: ControlSchemeEditForm
): ControlSchemeModel {
    const rawData = form.getRawValue();
    return {
        id: rawData.id,
        name: rawData.name,
        bindings: rawData.bindings.map((data) => ({
            operationMode: data.bindingFormOperationMode,
            ...data[data.bindingFormOperationMode]
        }) as ControlSchemeBinding)
    };
}
