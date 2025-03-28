import { ControlSchemeBinding } from '@app/store';

export interface IBindingFormMapper<TForm, TBindingModel> {
  mapToModel(id: ControlSchemeBinding['id'], form: TForm): TBindingModel;
}
