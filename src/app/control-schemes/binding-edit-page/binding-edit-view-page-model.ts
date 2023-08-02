import { ControlSchemeBinding } from '@app/store';

import { BindingEditAvailableOperationModesModel } from '../binding-edit';

export type BindingEditViewPageModel = {
    binding: ControlSchemeBinding;
    availabilityData: BindingEditAvailableOperationModesModel;
    controlSchemeId: string;
};
