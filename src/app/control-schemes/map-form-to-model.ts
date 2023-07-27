import { ControlSchemeBinding, ControlSchemeModel, attachedIosIdFn } from '@app/store';

import { ControlSchemeEditForm } from './edit';

export function mapFormToModel(
    form: ControlSchemeEditForm
): ControlSchemeModel {
    const rawData = form.getRawValue();
    const uniquePortIds = new Set(rawData.bindings.map((binding) => attachedIosIdFn(binding[binding.bindingFormOperationMode])));
    const portConfigs = rawData.portConfigs.filter((hubConfig) => uniquePortIds.has(attachedIosIdFn(hubConfig)));
    return {
        id: rawData.id,
        name: rawData.name,
        portConfigs,
        bindings: rawData.bindings.map((data) => ({
            operationMode: data.bindingFormOperationMode,
            ...data[data.bindingFormOperationMode]
        }) as ControlSchemeBinding)
    };
}
