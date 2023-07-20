import { FormGroup } from '@angular/forms';

export interface IBindingsSpecificsComponent<TBindingForm extends FormGroup = FormGroup> {
    setForm(form: TBindingForm): void;
}
