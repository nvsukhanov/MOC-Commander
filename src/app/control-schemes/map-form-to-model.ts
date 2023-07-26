import { ControlSchemeBinding, ControlSchemeModel } from '@app/store';

import { ControlSchemeEditForm } from './edit';

export function mapFormToModel(
    form: ControlSchemeEditForm
): ControlSchemeModel {
    const rawData = form.getRawValue();
    const uniqueHubIds = new Set(rawData.bindings.map((binding) => binding[binding.bindingFormOperationMode].hubId));
    const hubConfigurations = rawData.hubConfigs.filter((hubConfig) => uniqueHubIds.has(hubConfig.hubId));
    return {
        id: rawData.id,
        name: rawData.name,
        hubConfigurations,
        bindings: rawData.bindings.map((data) => ({
            operationMode: data.bindingFormOperationMode,
            ...data[data.bindingFormOperationMode]
        }) as ControlSchemeBinding)
    };
}
